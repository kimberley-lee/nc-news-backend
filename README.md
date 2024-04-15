In order to build the API to access the data correctly, you'll need to:

- Set up two .env files and set the database name in the global environment.
- Install the relevant DevDependencies and dependencies on your machine.
- Run the setup and seed (you can find the scripts in the package.json) to create the databases and seed the data.
- You will be interacting with the PSQL database through node-postgres when fetching the data.
- There are two sets of data - test and dev but you can use the index.js file to require in the relevant sets.
- The connection.js file will automatically determine which environment will run and will return an error if it doesn't find the database.
