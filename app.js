const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoint.controller");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles.controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
