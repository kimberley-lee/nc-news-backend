const { fetchComments } = require("../models/comments.model");

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = { getComments };
