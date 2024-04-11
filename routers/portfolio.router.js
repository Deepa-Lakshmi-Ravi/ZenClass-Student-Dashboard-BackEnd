const express = require("express");
const portfolioController = require("../controllers/portfolio.controller");

const portfolioRouter = express.Router();

//fetch all portfolio data
portfolioRouter.get("/portfolio", portfolioController.fetchPortfolio);

//posting new portfolio
portfolioRouter.post("/portfolio", portfolioController.postPortfolio);

module.exports = portfolioRouter;
