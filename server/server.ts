const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

const ENV = `${__dirname}/config.env`;
dotenv.config({ path: ENV });
const PORT = process.env.PORT || 3000;

/*
  We listen for unhandledExceptions on our process (running program). This is so
  our app does not unexpectedly terminate (without giving us info on the issue).
  We want to be able to listen for these so we can see what the issue is (ie. maybe
  we forgot to catch an error in one of our controllers).
*/
const errorHandling = require("./utils/errorHandling");
errorHandling.handleUncaught("unhandledException");

/*
Telling sequelize that we are using sqlite (so that it knows
what to do behind the scenes). We also tell it the file location
of our database, and we tell it to freezeTableName because we don't
want it adding a plural "S" to our table names. We want our table names
as WE SPECIFIED.
*/
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./cpsc471.sqlite",
  define: {
    freezeTableName: true,
  },
  logging: console.log,
});
sequelize.sync();
module.exports = sequelize;

/*
  We try connecting our app to the database. We do it once here
  so that we don't need to do it repeatedly.
*/
async function main() {
  try {
    const db = await sequelize.authenticate();
    console.log("Connected to database!");
  } catch (error) {
    console.error(error);
  }
}

main();

/*
  The port that listens for requests. On an actual website, it's not
  a port but instead a URL (like google.com). However, we don't have
  an actual website so we just use a port instead. Functions the same,
  but stops running if the program ends.
*/
const app = require("./app");
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
/*
  The server listens to requests and sends responses; this involves
  lots of promises. If any promise is rejected and unhandled, we want to close
  the server before terminating the program (leaving it open is not best practice).
*/
errorHandling.handleUncaught("unhandledRejection", server);
