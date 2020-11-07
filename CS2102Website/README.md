# Setting Up
1. Download the dependencies required
```
npm install ejs
npm install express
npm install nodemon
npm install pg
npm install body-parser
npm install express-validator
npm install passport
npm install passport-local
npm install bcrypt
npm install connect-flash
npm install cookie-parser
npm install express-session
```
2. Go to /CS2102Website/data/index.js and change the Postgres Credentials to your own. The code should look something like this:
```
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
})
```
3. Initialise the database by running the SQL commands in /CS2102Website/data/init.sql

4. Populate the database by running the code in /CS2102Website/data/dataPopulator.sql

5. Go to CS2102Website folder directory on your Terminal/Command Prompt. Run the website by typing this in Terminal/Command Prompt:
```
npm start
```

6. View the website on localhost:3030

# Folders
1. Data Folder
- index.js: connects to database and contain database related functions
- queries.js: contains all the SQL queries
- init.sql: SQL script to initialise the tables
- dataPopulator.sql: contains test data to populate database

2. Routes Folder
- Contains all the routings and logic for GET and POST requests

3. Public Folder
- css folder: contains styling for website
- favicon folder: contains icons for website
- images folder: contains images for website

4. Views Folder
- Contains Front End UI View for the website
