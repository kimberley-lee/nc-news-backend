const db = require("../db/connection");

const fetchComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => rows);
};

const insertComment = (article_id, body, author) => {
  return db
    .query(
      `INSERT INTO comments(article_id, body, author) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, body, author]
    )
    .then(({ rows }) => {
      return rows.length
        ? rows[0]
        : Promise.reject({ status: 404, message: "Not found" });
    });
};

const removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
    });
};

module.exports = { fetchComments, insertComment, removeComment };
