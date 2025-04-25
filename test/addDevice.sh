#!/bin/bash
curl --location 'http://localhost:8000/devices' \
--header 'Content-Type: application/json' \
--data '{
  "deviceid": 103,
  "branchname": "Newtown",
  "branchcode": 1002,
  "deviceserialno": "SN123457",
  "devicemodel": "Mod123",
  "deviceip": "192.168.1.11",
  "location": "Newtown1",
  "devicestatus": "Active"
}'
