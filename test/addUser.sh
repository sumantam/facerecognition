#!/bin/bash

curl --location 'http://localhost:8000/employees' \
--header 'Cookie: WebSession_97B2ED2FEF=b79d0e2af9586104d07ec27d7ddf964c55ae4d86ce029a7694795befd2b55a3a' \
--form 'empid="000135"' \
--form 'email="john.doe@example.com"' \
--form 'name="John Doe"' \
--form 'branchname="Sales"' \
--form 'branchcode="12"' \
--form 'location="New York"' \
--form 'mobilenumber="9986153670"' \
--form 'img=@"/mnt/c/Users/suman/projects/facerecognition/test/Diaconis.jpg"'