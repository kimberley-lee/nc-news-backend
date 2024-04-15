const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoint.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "Not found!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});
module.exports = app;
