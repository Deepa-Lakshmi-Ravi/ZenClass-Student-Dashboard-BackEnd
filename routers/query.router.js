const express = require("express");
const queryController = require("../controllers/query.controller");

const queryRouter = express.Router();

//fetch query
queryRouter.get("/query", queryController.fetchQuery);

//post new query
queryRouter.post("/query", queryController.postQuery);

//delete query
queryRouter.delete("/query/:id", queryController.deleteQuery);

module.exports = queryRouter;
