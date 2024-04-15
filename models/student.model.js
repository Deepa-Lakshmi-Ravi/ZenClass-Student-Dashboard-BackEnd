const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "FirstName is required"],
  },
  lastName: {
    type: String,
    requird: [true, "LastName is required"],
  },
  batch: {
    type: String,
    default: "B52WE-TAMIL",
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: [true, "Email is already taken"],
  },
  password: {
    type: String,
    require: [true, "Password is requird"],
  },
  contactNo: {
    type: String,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  noticePeriod: {
    type: String,
  },
  yearofpassing: {
    type: String,
  },
  portfolioUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  resumeUrl: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  webcata: {
    type: String,
    default: 0,
  },
  codeKata: {
    type: String,
    default: 0,
  },
  mockInterview: {
    type: String,
    default: 0,
  },
  leave: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
  ],
  testimonial: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Testimonial",
    },
  ],
  capstone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Capstone",
    },
  ],
  portfolio: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
    },
  ],
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  webcode: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webcode",
    },
  ],
  query: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
    },
  ],
  mock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mock",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const studentModel = mongoose.model("Student", studentSchema);
module.exports = studentModel;
