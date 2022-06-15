# lightBnB

lightBnb is a simple full-stack application that uses the PostgreSQL relational database system and Node to manage the backend. HTML, CSS3, SASS and JQuery have been used to create the front-end.

## Dependencies

- bcrypt
- body-parser
- cookie-session
- express
- nodemon
- pg
- PostgreSQL

## Getting Started
Clone the remote repo to a folder named `lightbnb`

### Database Setup
First a test database (db) must be created with seed data in it:

1. `cd lightbnb`
2. Start the PostgreSQL server by using the `psql` command in your CLI.
3. Create the lightbnb db using `CREATE DATABASE lightbnb;`
4. Connect to the db using `\c lightbnb`
5. Add tables to the db using `\i migrations/01_schema.sql`
6. Add seed data using `\i seeds/02_seeds.sql`

### Application Setup
1. `cd LightBnB_WebApp-master` and install dependencies using the `npm install` command.
2. Start the web server using the `npm start` command. The app will be served at <http://localhost:3000/>. You should see a `Connected to the database successfully!!` message on the CLI.
3. Go to <http://localhost:3000/> in Google Chrome ot access the application.
4. Properties from the seed data can be searched using optional query parameters via the search link.
5. User can log in via emails from the seed data.
6. Once logged in, a new listing can be added with the Create Listing link. Also, existing reservations and their own property listings can be seen.
7. Lastly, new users can be added by clicking the Sign Up link.


## Known issues

1. This application has only been tested in Google Chrome so far therefore behavior could be unexpected in other browsers.
2. The seed data is fake data.
3. Front end leaves something to be desired for.
4. This setup process assumes user has PostgreSQL already installed.

