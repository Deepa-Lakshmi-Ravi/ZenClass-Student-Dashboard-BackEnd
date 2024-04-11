const mongoose = require("mongoose");

const querySchema = mongoose.Schema({
  queryTitle: {
    type: String,
    required: true,
  },
  queryDesc: {
    type: String,
    required: true,
  },
  appliedOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Not assigned",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const QueryModel = mongoose.model("Query", querySchema);
module.exports = QueryModel;
