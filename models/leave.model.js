const mongoose = require("mongoose");

const leaveSchema = mongoose.Schema({
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
  appliedOn: {
    type: String,
    required: [true, "Date is missing"],
  },
  status: {
    type: String,
    default: "Waiting for approval",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const leaveModel = mongoose.model("Leave", leaveSchema);
module.exports = leaveModel;
