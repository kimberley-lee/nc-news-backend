const commentsRouter = require("express").Router();
const {
  deleteComment,
  patchCommentByCommentId,
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
