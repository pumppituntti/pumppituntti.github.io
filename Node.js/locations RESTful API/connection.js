const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
});

let connectionFunctions = {
  connect: () =>
    new Promise((resolve, reject) => {
      connection.connect((err) => {
        reject(err);
      });
      resolve();
    }),

  close: () =>
    new Promise((resolve, reject) => {
      connection.end((err) => {
        reject(err);
      });
      resolve();
    }),

  save: (location) => {
    return new Promise((resolve, reject) => {
      let sql =
        "insert into locations (latitude, longitude) values (" +
        connection.escape(location.latitude) +
        ", " +
        connection.escape(location.longitude) +
        ")";
      connection.query(sql, (err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully saved!");
        }
      });
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      connection.query("select * from locations", (err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve(locations);
        }
      });
    });
  },

  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      let sql = "delete from locations where id = " + connection.escape(id);
      connection.query(sql, (err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully deleted!");
        }
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      let status = 404;
      let sql = "select * from locations where id = " + connection.escape(id);
      connection.query(sql, (err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve(locations);
        }
      });
    });
  },

  filter: (query) => {
    return new Promise((resolve, reject) => {
      let status = 404;
      let sql = `select * from locations where ${query} `;
      connection.query(sql, (err, locations) => {
        if (err) {
          reject(err);
        } else {
          resolve(locations);
        }
      });
    });
  },
};

module.exports = connectionFunctions;
