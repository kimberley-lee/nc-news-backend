const db = require("../db/connection");

const fetchArticles = (topic) => {
  let queryVal = [];
  let queryStr = `SELECT
    articles.article_id, 
    articles.author, 
    articles.title, 
    articles.topic, 
    articles.created_at, 
    articles.article_img_url, 
    articles.votes, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id `;

  if (topic) {
    queryVal.push(topic);
    queryStr += `WHERE topic = $1 `;
  }

  queryStr += `GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(queryStr, queryVal).then(({ rows }) => rows);
};

const fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      return rows.length
        ? rows[0]
        : Promise.reject({ status: 404, message: "Not found" });
    });
};

const checkArticleIDExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article ID not found" });
      }
    });
};

const updateArticleById = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then(({ rows }) => {
      return rows.length
        ? rows[0]
        : Promise.reject({ status: 404, message: "Not found" });
    });
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  checkArticleIDExists,
  updateArticleById,
};
