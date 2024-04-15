const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Not found!" });
});
module.exports = app;
