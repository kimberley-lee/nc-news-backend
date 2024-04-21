const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  insertArticle,
  getTotalCount,
} = require("../models/articles.model");
const { checkTopicExists } = require("../models/topics.model");

const getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  Promise.all([
    fetchArticles(topic, sort_by, order, limit, p),
    getTotalCount(topic),
    checkTopicExists(topic, sort_by, order, limit, p),
  ])
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const postArticle = (req, res, next) => {
  const { author, title, topic, body, article_img_url } = req.body;
  insertArticle(author, title, topic, body, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

module.exports = { getArticleById, getArticles, patchArticleById, postArticle };
