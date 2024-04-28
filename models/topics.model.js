const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => rows);
};

const checkTopicExists = (topic) => {
  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, message: "Not found" });
        }
      });
  }
};

const insertTopic = (description, slug) => {
  return db
    .query(
      `INSERT INTO topics(description, slug) VALUES ($1, $2) RETURNING *`,
      [description, slug]
    )
    .then(({ rows }) => rows);
};

module.exports = { fetchTopics, checkTopicExists, insertTopic };
