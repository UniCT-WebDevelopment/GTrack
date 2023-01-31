# GTrack
Gtrack is a software born to manage logistic companies. You can handle deliveries, customers, packages, tracks and more in a single suite.

# Technologies (Explaination and how to configure)

## Dotnet core backend
The backend was developed with dotnet core 5.0 and MVC structure. All the endpoints are exposed by a single backend, that provides authentication and authorization (RBAC)
using a middleware that associate the user to a temporary jwt token.
Some endpoints are reserved to Admin users while some endpoints are accessible to every authenticated user.

### Project structure
* In the /Controllers folder you can find every controller that exposes all the necessary API for every CRUD operation for a specific entity.
* Each controller is named as {EntityName}Controller.cs, so you can understand which entity the controller is delegated to handle.
* In the /Models folder you can find the C# class that defines the DTO for every specific entity.
* Each class is named as {EntityName}.cs so you can understand which entity is represented by the class that you see.

## Mysql Database
The backend uses a MySql database to store data. The connection is right now a single one, always available to the Database. So parallel requests are queued
to guarrantee less load for the Database. N.B it could be easily changed by registering the Database connection with a different scope than singleton in the Startup.cs.

The database **ConnectionStirng** is defined in the appsettings.json file, so you **must** configure it correctly in order to make the backend works.

### Configure database
* In the /MYSQL folder you can find an SQL dump that you need to import into your Database manager. You can simply execute the content of the db_dump.sql file as an SQL query.
* After you have executed the SQL query, you should have correctly imported the "GTrack" database with structure and example data.
* Be sure to have configured the user access in order to put that credentials in the connectionstring (appssettings.json). 


## Angular frontend
The frontend (client app) was developed using Angular, node v.14 and typescript. Angular provides some useful functionalities such us routing, dependency injection,
guards, resolvers and more, that were important to make the project lean and maintainable over time.

### Frontend project structure
* In the folder /ClientApp/src you can find the entire source project of the client app.
* In the folder /ClientApp/src/app/modules/content-modules you can find every single lazy module that is loaded and showed to the user in order to manage a specific aspect of his company.
* Every "content-module" folder is named as the entityName that every component defined inside has the responsibility to handle.
* Each "specific" component uses a generic structure that involves some components, services, resolvers in order to make available the CRUD operations of each specific entity.


# How to run (development)
* You can run separately the client app and backend service.
* To run the Client app go to /ClientApp/src/ and run the command "npm i". It will install all the required dependencies. 
* run the command "ng serve". (it will run the UI trough port 4200 by default). 
* Optionally you might change the url for the backend in the file /ClientApp/src/main.ts if your dotnet server will not be run in the default port (5001).
* To run the dotnet backend service go to the root directory and run the command "dotnet run".
* Go to http://localhost:4200 to see the application in development mode.

# How to build (release)
* The entire package can be built using a single command since the backend is able to handle the client app compilation, dependencies load and build.
* Go to the root directory and run the command "**dotnet publish --configuration Release --output ../Release**"
* Go to the output folder "../Release" and run the executable file.
* Go to http://localhost:5001/index.html to use your released app. 


# Default access:
* Admin: [email: admin@gtrack.com ; password: Admin1]
* Operator: [email operator@gtrack.com : password: Operator1] 
 


