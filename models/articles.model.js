const db = require("../db/connection");

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  let orderType = "DESC";
  if (order === "asc") {
    orderType = "ASC";
  }
  const validSortBys = [
    "created_at",
    "topic",
    "title",
    "author",
    "votes",
    "article_img_url",
  ];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid input" });
  }

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

  queryStr += `GROUP BY articles.article_id `;

  if (sort_by === "created_at") {
    queryStr += `ORDER BY ${sort_by} ${orderType}`;
  } else if (validSortBys) {
    queryStr += `ORDER BY ${sort_by} ${orderType}`;
  }

  return db.query(queryStr, queryVal).then(({ rows }) => rows); // promise.reject?
};

const fetchArticleById = (id) => {
  return db
    .query(
      `SELECT
      articles.article_id, 
      articles.author, 
      articles.title, 
      articles.topic, 
      articles.body,
      articles.created_at, 
      articles.article_img_url, 
      articles.votes,
      COUNT(comments.article_id)::INT AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
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
