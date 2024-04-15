const { fetchData } = require("../models/topics.models.js");

const getTopics = (req, res, next) => {
  fetchData().then((topics) => {
    res.status(200).send({ topics });
  });
};

module.exports = { getTopics };
