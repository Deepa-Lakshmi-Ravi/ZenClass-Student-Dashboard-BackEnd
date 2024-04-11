const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const taskModel = require("../models/task.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};

//Fetching for task student
const fetchTask = async (req, res) => {
  try {
    //Getting token for authorized student
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session timeout please login again",
      });
    }
    //verifying the token
    const decodedToken = await auth.decodeToken(token);

    if (!decodedToken.id) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    //send response data
    const tasks = await studentModel.findById(decodedToken.id).populate("task");

    res.status(200).json(tasks.task);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//fetching all tasks for evaluation

const fetchAllTask = async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//Posting new task

const postTask = async (req, res) => {
  try {
    //getting body content
    const {
      day,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
    } = req.body;

    //getting token
    const token = getToken(req);
    const decodedToken = await auth.decodeToken(token);

    //if token is not valid return error
    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: "Session timeout please login again",
      });
    }
    //getting logged student to store task
    const student = await studentModel.findById(decodedToken.id);

    //checking task alraedy submitted or not
    const matchedTask = await taskModel.findOne({ check });
    if (matchedTask) {
      return res.status(400).json({
        message: "Task already submitted",
      });
    }

    //prepare data to push into task collection
    const newTask = new taskModel({
      day,
      frontEndCode,
      frontEndURL,
      backEndCode,
      backEndURL,
      task,
      title,
      check,
      student: student._id,
    });

    //saving new task in collection
    const savedTask = await newTask.save();

    //loading task id to student collection
    student.task = student.task.concat(savedTask._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
    });
  } catch (err) {
    //Handle error
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error on updating,please try again later",
    });
  }
};

//posting new task

const updateTaskScore = async (req, res) => {
  try {
    //getting body content
    const { id, score } = req.body;

    //getting matchedtask to update score task
    const matchedTask = await taskModel.findOne({ _id: id });
    if (!matchedTask) {
      return res.status(400).json({
        success: false,
        message: "Task not found or already evaluated",
      });
    }

    //saving task score in collection
    matchedTask.score = score;

    await taskModel.findByIdAndUpdate(matchedTask.id, matchedTask);

    //sending response
    res.status(200).json({
      success: true,
      message: "Task score updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error on updating please try again later",
    });
  }
};

module.exports = {
  fetchTask,
  fetchAllTask,
  postTask,
  updateTaskScore,
};
