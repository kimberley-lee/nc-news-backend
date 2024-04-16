const db = require("../db/connection");

const fetchComments = (article_id) => {
  console.log(article_id);
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id = $1`, [
      article_id,
    ])
    .then(({ rows }) => rows);
};

module.exports = { fetchComments };
