const express = require("express");
const studentController = require("../controllers/student.controller");

const router = express.Router();

router.post("/signup", studentController.SignUp);
router.post("/login", studentController.SignIn);
router.post("/forgot-password", studentController.ForgetPassword);
router.post("/reset-password/:randomString/:expirationTimestamp", studentController.ResetPassword);
router.put("/update", studentController.updateStudentProfile);

module.exports = router;
