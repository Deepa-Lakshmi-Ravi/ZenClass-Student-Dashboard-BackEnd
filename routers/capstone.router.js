const express = require("express");
const capstoneController = require("../controllers/capstone.controller");

const capstoneRouter = express.Router();

//fetch all capstone data
capstoneRouter.get("/capstone", capstoneController.fetchCapstone);

//post new capstone data
capstoneRouter.post("/capstone", capstoneController.postCapstone);

module.exports = capstoneRouter;
