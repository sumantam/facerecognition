#!/bin/bash
curl --location 'http://localhost:8000/branches' \
--header 'Content-Type: application/json' \
--data '{
  "branchid": 11,
  "branchname": "KHP",
  "location": "KHALATPUR",
  "branchaddress": "Udaynarayanpur, Howrah",
  "branchmedium": "Bengali"
}'
