- Start the backend service by running `docker-compose up --build`

- Verify you can hit the backend service: GET http://localhost:5050/api/health

- Shut down the backend service safely with `docker-compose down` This will persist the database. If you want to shutdown the backend service and not persist the database, do `docker-compose down -v`.

- There is a default admin log in. Username: admin, Password: Password123

