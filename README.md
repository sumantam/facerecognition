When starting the application for the first time make sure
postgresql is installed
sudo -iu postgres psql -c "ALTER USER postgres WITH PASSWORD 'yourpassword';"

To start the backend you must run 
oetry run uvicorn api.server:app --reload
