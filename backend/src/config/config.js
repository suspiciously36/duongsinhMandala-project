// require("dotenv").config();
// const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DRIVER } =
//   process.env;
// module.exports = {
//   development: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_DATABASE,
//     host: DB_HOST,
//     dialect: DB_DRIVER,
//   },
//   test: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_DATABASE,
//     host: DB_HOST,
//     dialect: DB_DRIVER,
//   },
//   production: {
//     username: DB_USERNAME,
//     password: DB_PASSWORD,
//     database: DB_DATABASE,
//     host: DB_HOST,
//     dialect: DB_DRIVER,
//   },
// };
// config/config.js
require("dotenv").config();
const pg = require("pg");
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER || "postgres",
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER || "postgres",
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER || "postgres",
    port: process.env.DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    dialectModule: pg,
  },
};
