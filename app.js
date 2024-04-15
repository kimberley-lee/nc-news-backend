const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoint.controller");
const { getArticlesById } = require("./controllers/articles.controller");

const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesById);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  }
  next(err);
});

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});
module.exports = app;
