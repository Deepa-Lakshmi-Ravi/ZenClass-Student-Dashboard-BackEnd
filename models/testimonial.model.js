const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  videoUrl: {
    type: String,
    required: [true, "Url is missing"],
  },
  desc: {
    type: String,
    required: [true],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

const testmonialModel = mongoose.model("Testimonial", testimonialSchema);
module.exports = testmonialModel;
