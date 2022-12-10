# Reiman Reality
A service to provide a dynamic AR experience to the guests visiting Reiman Gardens


## Code overview
The code is split up into a few seperate places 

### Frontend 
	This houses the front end HTML and JS code. You can find scripts here that handle the creation of the Aframe scene and placing models and markesr into the world.
### SRC 
	the src folder contains the actual server code including the mardia db connection code and the admin router and public router to seperate waht the admin side and user side needs.
### index.ts 
	This file is the main entry point for the program allowing the server to actually start.
### static
	this contains most of the admin side front end code with it's scripts split up seperately.

## Build Instructions

1. Clone the directory
2. Setup a maria db instance 
3. give proper permissions to the database.sh file with "sudo chmod 777 database.sh"
4. run the database.sh file and follow instructions it provides
5. Copy `.env-example` to a new file called `.env` and modify with appropriate database information
6. Install Node.js and npm
7. Run included in the package.json is a script so you can use `npm run start` to start the server

## Tools and Frameworks Used

- NODE js https://nodejs.org/en/
- NPM https://www.npmjs.com/
- TYPESCRIPT https://www.typescriptlang.org/
- KOA js as a backend framework: https://koajs.com/
