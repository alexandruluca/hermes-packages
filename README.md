# hermes-packages

Serving the project using nginx

```
> yum install nginx
```

nginx.conf file assuming the BE is started on port 8090

```
	root /opt/deployments/hermes-packages/hermes-packages-www/dist/hermes-packages-web;
	index index.html;

	location / {
		# Try to serve static files first, else fallback to index.html
		try_files $uri $uri/ /index.html;
	}

    location /socket.io/ {
		proxy_pass http://localhost:8090;
        proxy_redirect off;

        proxy_http_version      1.1;

        proxy_set_header        Upgrade                 $http_upgrade;
        proxy_set_header        Connection              "upgrade";

        proxy_set_header        Host                    $host;
        proxy_set_header        X-Real-IP               $remote_addr;
        proxy_set_header        X-Forwarded-For         $proxy_add_x_forwarded_for;

  }

	location /api {
		try_files $uri $uri/ @api;
  	}

  	# Api backend
  	location @api {
		proxy_pass http://127.0.0.1:8090;
      	proxy_set_header Host $host;
      	proxy_set_header X-Real-IP $remote_addr;
      	proxy_set_header X-Scheme $scheme;
      	proxy_connect_timeout 1;
      	proxy_send_timeout 30;
      	proxy_read_timeout 30;
  	}
```

# Include new conf in nginx default conf

cd /etc/nginx && nano nginx.conf

In the "server" section add following
```
listen       443 ssl;
listen       [::]:443 ssl;

include /opt/data/nginx/hermes-packages.conf;
```