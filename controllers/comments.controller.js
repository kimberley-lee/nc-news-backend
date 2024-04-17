const {
  fetchComments,
  insertComment,
  removeComment,
} = require("../models/comments.model");
const { checkArticleIDExists } = require("../models/articles.model");

const getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id), checkArticleIDExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, author } = req.body;
  insertComment(article_id, body, author)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { getComments, postComment, deleteComment };
