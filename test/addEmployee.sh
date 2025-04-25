#!/bin/bash
	curl --location 'http://localhost:8000/employees' \
	--form 'empid="112"' \
	--form 'email="ss@abc.com"' \
	--form 'name="Sarif Seikh"' \
	--form 'branchname="Newtown"' \
	--form 'branchcode="21"' \
	--form 'role="user"' \
	--form 'designation="Teacher"' \
	--form 'countrycode="91"' \
	--form 'mobilenumber="9232645650"' \
	--form 'img=@"/mnt/c/Users/Sarif/Project/facerecognition/abc.jpg"' \
	--form 'location="Kolkata"'
