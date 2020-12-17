curl 'http://localhost:8090/api/projects' \
  --user package:ewfj0gre \
  -H 'accept: application/json' \
  -H 'Referer: http://localhost:8090/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36' \
  -H 'Content-Type: application/json' \
  --data-binary $'{\n  "name": "string",\n  "type": "aws",\n  "stages": [\n    {\n      "name": "name", "band": "develop",\n      "resourceType": "lambda",\n      "resourceName": "aluca-test-lambda",\n      "regions": [\n        "eu-west-1"\n      ],\n      "runtime": "nodejs"\n    }\n  ]\n}' \
  --compressed