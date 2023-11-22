const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const md5 = require("md5");

const dotenv = require("dotenv");
const ENV = `${__dirname}/config.env`;
dotenv.config({ path: ENV });

const app = require("./app");
const models = require("./models");
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const db = await sqlite.open({
      filename: process.env.DB || "./cpsc471.db",
      driver: sqlite3.Database,
    });
    console.log("Connected to database!");
    exports.db = db;

    models.createAllTables(db);
  } catch (error) {
    console.error(error);
  }
}

main();

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
