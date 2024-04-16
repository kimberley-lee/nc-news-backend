const {
  fetchArticlesById,
  fetchArticles,
  updateArticlesById,
  checkArticleIDExists,
} = require("../models/articles.model");
const { insertComments } = require("../models/comments.model");

const getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

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

const patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    updateArticlesById(article_id, inc_votes),
    checkArticleIDExists(article_id),
  ])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

module.exports = { getArticlesById, getArticles, patchArticlesById };
