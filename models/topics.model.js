const db = require("../db/connection");

const fetchData = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchData };
