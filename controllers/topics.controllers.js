const { fetchData } = require("../models/topics.model.js");

const getTopics = (req, res, next) => {
  fetchData()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
