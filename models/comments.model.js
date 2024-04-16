const db = require("../db/connection");

const fetchComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article ID not found" });
      }
      return rows;
    });
};

module.exports = { fetchComments };
