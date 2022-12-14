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
7. Run included in the package.json is a script so you can use `npm run start` to start the server ( NOTE: if npm run start fails to use port 80 and 443 on linux try npm run build and sudo node dist/index.js instead )
8. If wanting to run this as a service you can use the service file provided with some updates to arserver-example.service to get the service running. ( see https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units )

## Tools and Frameworks Used

- NODE js https://nodejs.org/en/
- NPM https://www.npmjs.com/
- TYPESCRIPT https://www.typescriptlang.org/
- KOA js as a backend framework: https://koajs.com/

## adding new markers
Instructions are included for a faster node js version 
here: https://ar-js-org.github.io/NFT-Marker-Creator/
and the web version is 
here: https://carnaux.github.io/NFT-Marker-Creator/#/
