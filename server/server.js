const sqlite3 = require("sqlite3").verbose();
// const md5 = require("md5");

const app = require("./app");
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database("./cpsc471.db", (error) => {
  if (error) {
    // cannot connect to DB file
    console.error(error.message);
  } else {
    console.log("Connected to database!");
  }
});

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
