const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
};

module.exports = { fetchTopics };
