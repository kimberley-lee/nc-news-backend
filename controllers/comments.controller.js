const { fetchComments } = require("../models/comments.model");
const { checkArticleIDExists } = require("../models/articles.model");

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id), checkArticleIDExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = { getComments };
