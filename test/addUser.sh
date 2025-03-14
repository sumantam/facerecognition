#!/bin/bash

curl -X 'POST' 'http://127.0.0.1:8000/employees' \
-F 'empid=101' \
-F 'email=john.doe@example.com' \
-F 'name=John Doe' \
-F 'branchname=Sales' \
-F 'branchcode=12' \
-F 'location=New York' \
-F 'img=@/path/to/local/image.jpg'
