const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics-router");
const articlesRouter = require("../routes/articles-router");
const commentsRouter = require("../routes/comments-router");
const usersRouter = require("../routes/users-router");
const { getEndpoints } = require("../controllers/endpoint.controller");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
