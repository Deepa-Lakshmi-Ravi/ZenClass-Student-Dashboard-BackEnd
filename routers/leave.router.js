const express = require("express");
const leaveController = require("../controllers/leave.controller");

const leaveRouter = express.Router();

//fetch all leave data
leaveRouter.get("/leave", leaveController.fetchLeave);

//post new leave
leaveRouter.post("/leave", leaveController.postLeave);

//delete leave data
leaveRouter.delete("/leave/:id", leaveController.deleteLeave);

module.exports = leaveRouter;
