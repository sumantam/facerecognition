curl --location 'http://localhost:8000/devices' \
--header 'Content-Type: application/json' \
--data '{
  "deviceid": 101,
  "branchname": "Main Branch",
  "branchcode": 1001,
  "deviceserialno": "SN123456",
  "devicemodel": "ModelX",
  "deviceip": "192.168.1.10",
  "location": "Server Room",
  "devicestatus": "Active"
}'