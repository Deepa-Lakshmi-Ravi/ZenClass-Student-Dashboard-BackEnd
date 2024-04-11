const mongoose = require("mongoose");

const portfolioSchema = mongoose.Schema({
  portfolioUrl: {
    type: String,
    required: [true, "Url is required"],
  },
  githubUrl: {
    type: String,
    required: [true, "Url is required"],
  },
  resumeUrl: {
    type: String,
    required: [true, "Url is required"],
  },
  status: {
    type: String,
    default: "Submitted",
  },
  comment: {
    type: String,
    default: "Not yet reviewed",
  },
  reviewedBy: {
    type: String,
    default: "Not yet reviewed",
  },
  submittedOn: {
    type: Date,
    default: Date.now(),
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const portfolioModel = mongoose.model("Portfolio", portfolioSchema);
module.exports = portfolioModel;
