const express = require("express");
const taskController = require("../controllers/task.controller");

const taskRouter = express.Router();

//fetch task
taskRouter.get("/task", taskController.fetchTask);

//fetch all task
taskRouter.get("/task/all", taskController.fetchAllTask);

//posting new task
taskRouter.post("/task", taskController.postTask);

//update task evaluation
taskRouter.patch("/task/evaluation", taskController.updateTaskScore);

module.exports = taskRouter;
