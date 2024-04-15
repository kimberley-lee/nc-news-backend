const { fetchArticlesById } = require("../models/articles.model");

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticlesById };
