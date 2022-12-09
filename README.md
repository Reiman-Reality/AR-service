# Reiman Reality
A service to provide a dynamic AR experience to the guests visiting Reiman Gardens

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
