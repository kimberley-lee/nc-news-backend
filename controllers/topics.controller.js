const { fetchTopics, insertTopic } = require("../models/topics.model.js");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  const { description, slug } = req.body;
  insertTopic(description, slug).then((topic) => {
    res.status(201).send({ topic });
  });
};
module.exports = { getTopics, postTopic };
