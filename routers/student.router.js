const express = require("express");
const studentController = require("../controllers/student.controller");

const studentRouter = express.Router();

studentRouter.post("/signup", studentController.SignUp);
studentRouter.post("/login", studentController.SignIn);
studentRouter.post("/forgot-password", studentController.ForgetPassword);
studentRouter.post("/reset-password/:randomString/:expirationTimestamp", studentController.ResetPassword);
studentRouter.patch("/update", studentController.updateStudentProfile);

module.exports = router;
