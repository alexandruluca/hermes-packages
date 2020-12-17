curl 'http://localhost:8090/api/deployments/hermes-node-sample-app/pullrequest/6/install' \
  -X 'PUT' \
  -H 'Connection: keep-alive' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'Accept: */*' \
  -H 'Origin: http://localhost:4200' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: http://localhost:4200/' \
  -H 'Accept-Language: en,ro-RO;q=0.9,ro;q=0.8,en-US;q=0.7,de;q=0.6,fr;q=0.5' \
  -H 'Cookie: client-timezone=Europe/Bucharest; connect.sid=s%3Aw4x0PV3wX605hTAPvqhh5OmObjLpJGdi.6LHIU8KH09QleUl1gV5Yqbq7SpKmPE6LvPBtZNKeEdY; io=Emsy8XcMDX8aiETUAAAC' \
  --data-binary '{"stageIdentifier":"spec-be-qa"}' \
  --compressed


# http://localhost:8090/api/deployments/hermes-node-sample-app/pullrequest/4/install
# http://localhost:8090/api/deployments/hermes-node-sample-app/pullrequest/6/install