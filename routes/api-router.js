const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics-router");
const { getEndpoints } = require("../controllers/endpoint.controller");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
