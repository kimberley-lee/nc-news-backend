# NC News

A backend project for Northcoders News, a reddit-like app used to access a database of articles and comments.

A link to the project can be found here: https://nc-news-backend-yyld.onrender.com/api

## Getting Started

### Pre-requisites:

Before you start, ensure you have installed the following:

- Postgres

  To install Postgres, go to: [Postgres](https://www.postgresql.org/download/)

  The minimum version required is v14.10

- Node.js

  To install Node, go to: [Node](https://nodejs.org/en/download/)

  The minimum version required is v21.4.0

### Installation:

Follow these instructions to help you run a copy of the project on your local machine.

1. Clone a copy of the repository on to your local machine using the command below:

   ` git clone https://github.com/kimberley-lee/nc-news-backend.git`

2. Install the associated devDependencies and dependencies:

   `npm install`

### Setting up `.env` files:

In order to create your database and seed the relevant data, you will need to:

1. Set up three '.env' files in the root and name them:

   `.env.test`

   `.env.development`

2. set the database name in the global environment:

   In the '.env.test', type in:

   `PGDATABASE=nc_news_test`

   In the '.env.development', type in:

   `PGDATABASE=nc_news`

The 'connection.js' file will automatically find and connect to the appropriate environments.

_NOTE: If you are using Linux, you will need to include your PSQL username and password too._

3. Add the '.env' files to a .gitignore using the following:

   `.env.*`

## Seeding the database

1. Set up the database by running the following script:

   `npm run setup-dbs`

2. To seed the development database with a set of data:

   `npm run seed`

## Running the test data:

Test data has been provided as well as tests developed during the TDD process, including tests for error handling. If you'd like to run these, use the following command:

`npm run test app`

If you'd like to run the tests written for the utils functions, use the following command:

`npm run test utils`

## Built with:

- [Node](https://nodejs.org/en/) - JavaScript runtime environment
- [PostgreSQL](https://www.postgresql.org/) - Open source relational database system
- [Express](https://expressjs.com/) - Node.js web application server framework
