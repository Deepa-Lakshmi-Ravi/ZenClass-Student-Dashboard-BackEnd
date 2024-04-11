const express = require("express");
const mockController = require("../controllers/mock.controller");

const mockRouter = express.Router();

//fetch all mock data
mockRouter.get("/mock", mockController.fetchMock);

//post new mock data
mockRouter.post("/mock", mockController.postMock);

module.exports = mockRouter;
