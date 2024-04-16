const db = require("../db/connection");

const fetchComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

const insertComments = (article_id, body, author) => {
  return db
    .query(
      `INSERT INTO comments(article_id, body, author) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, body, author]
    )
    .then(({ rows }) => rows[0]);
};
module.exports = { fetchComments, insertComments };
