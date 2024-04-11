const mongoose = require("mongoose");

const mockSchema = mongoose.Schema({
  interviewDate: {
    type: Date,
    default: Date.now(),
  },
  interviewerName: {
    type: String,
  },
  interviewRound: {
    type: String,
  },
  attended: {
    type: Boolean,
    default: "Yes",
  },
  comments: {
    type: String,
  },
  logicalScore: {
    type: String,
  },
  overallScore: {
    type: String,
  },
  recordingUrl: {
    type: String,
    default: "www.google.com",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const mockModel = mongoose.model("Mock", mockSchema);
module.exports = mockModel;
