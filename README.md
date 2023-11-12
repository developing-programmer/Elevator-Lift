# Elevator-Lift-System

# README #
The backend services for an elevator system with a microservice architecture project, 

Software and tools required (Pre-Requisites)
1. Nodejs ( v16.x.x)
2. npm ( v8.x.x)
3. PostgreSQL ( v15)

Steps to run the project in developers local machine
1. Clone the repository.
2. Navigate to the cloned project directory.
4. Rename the server.env.template config files to server.env and add configurations.
5. Run scripts in database/scripts directory
6. Navigate to elevator-service folder and run commands below: 
   1. npm i 
   2. npm run dev
   3. Open the running server with extension "/swagger/v1/" once server is running to access API documentation
      e.g http://localhost:8080/swagger/v1/