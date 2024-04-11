const mongoose = require("mongoose");

const capstoneSchema = mongoose.Schema({
  title: {
    type: String,
    default: "Zen class student dashboard",
  },
  comment: {
    type: String,
    default: "Waiting for review",
  },
  score: {
    type: String,
    default: "Waiting for review",
  },
  status: {
    type: String,
    default: "Submitted",
  },
  submittedOn: {
    type: Date,
    default: Date.now(),
  },
  frontendCode: {
    type: String,
    required: [true, "Frontend Code is required"],
  },
  backendCode: {
    type: String,
    required: [true, "Backend Code is required"],
  },
  frontendUrl: {
    type: String,
    required: [true, "Frontend Url is required"],
  },
  backendUrl: {
    type: String,
    required: [true, "Backend Url is required"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const capstoneModel = mongoose.model("Capstone", capstoneSchema);
module.exports = capstoneModel;
