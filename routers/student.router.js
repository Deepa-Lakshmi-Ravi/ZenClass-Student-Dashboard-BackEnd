const express = require("express");
const studentController = require("../controllers/student.controller");

const studentRouter = express.Router();

studentRouter.post("/signup", studentController.SignUp);
studentRouter.post("/login", studentController.SignIn);
studentRouter.post("/forgot-password", studentController.ForgotPassword);
studentRouter.post("/reset-password/:id", studentController.ResetPassword);
studentRouter.patch("/update", studentController.updateStudentProfile);

module.exports = studentRouter;
