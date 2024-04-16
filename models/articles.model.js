const db = require("../db/connection");

const fetchArticles = () => {
  return db
    .query(
      `SELECT 
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
      ON comments.article_id = articles.article_id 
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => rows);
};

const fetchArticlesById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Not found" });
      }
      return rows[0];
    });
};

const checkArticleIDExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, message: "Article ID not found" });
      }
    });
};

const updateArticlesById = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [votes, id]
    )
    .then(({ rows }) => rows[0]);
};

module.exports = {
  fetchArticlesById,
  fetchArticles,
  checkArticleIDExists,
  updateArticlesById,
};
