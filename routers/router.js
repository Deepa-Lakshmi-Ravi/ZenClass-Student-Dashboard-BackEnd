const express = require("express");
const studentRouter = require("./student.router");
const taskRouter = require("./task.router");
const queryRouter = require("./query.router");
const portfolioRouter = require("./portfolio.router");
const mockRouter = require("./mock.router");
const leaveRouter = require("./leave.router");
const capstoneRouter = require("./capstone.router");
const testimonialRouter = require("./testimonial.router");

const router = express.Router();

router.use("/student", studentRouter);
router.use("/student", taskRouter);
router.use("/student", queryRouter);
router.use("/student", portfolioRouter);
router.use("/student", mockRouter);
router.use("/student", leaveRouter);
router.use("/student", capstoneRouter);
router.use("/student", testimonialRouter);

module.exports = router;
