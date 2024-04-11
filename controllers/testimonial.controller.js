const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const testimonialModel = require("../models/testimonial.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer")) {
    return authorization.replace("bearer", "");
  }
};

//fetch all testimonial data
const fetchTestimonial = async (req, res) => {
  try {
    //Getting token for authorized student
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session timeout please login again",
      });
    }
    //verifying the token
    const decodedToken = await auth.decodeToken(token);

    if (!decodedToken.id) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    //send response data
    const testimonials = await studentModel
      .findById(decodedToken.id)
      .populate("testimonial");

    res.status(200).json(testimonials.testimonial);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting new testimonial
const postTestimonial = async (req, res) => {
  try {
    //getting body content
    const { image, videoUrl, desc } = req.body;

    //getting token
    const token = getToken(req);
    //decode token
    const decodedToken = await auth.decodeToken(token);

    //if token is not valid return error
    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: "Session timeout please login again",
      });
    }
    //getting logged student to store testimonial
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into testimonial collection
    const newTestimonial = new testimonialModel({
      image,
      videoUrl,
      desc,
      student: student._id,
    });

    //saving new testimonial in collection
    const savedTestimonial = await newTestimonial.save();

    //loading testimonial id to student collection
    student.testimonial = student.testimonial.concat(savedTestimonial._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Testimonial created successfully",
    });
  } catch (err) {
    //Handle error
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Please fill all data",
    });
  }
};

//deleting testimonial

const deleteTestimonial = async (req, res) => {
  try {
    //getting body content
    const id = req.params.id;

    //getting token
    const token = getToken(req);

    //verify the token
    const decodedToken = await auth.decodeToken(token);

    //if token is not valid , return error
    if (!decodedToken) {
      return res.status(401).json({
        message: "Session time out please login again",
      });
    }
    //if testimonial not found throw error
    const matchedTestimonial = await testimonialModel.findById(id);
    if (!matchedTestimonial) {
      return res.status(401).json({
        message: "Testinomial data not found",
      });
    }
    //deleting testimonial from collection
    await testimonialModel.findByIdAndDelete(id);

    //removing from student db
    await studentModel.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { testimonial: id },
      },
      { new: true }
    );

    //sending response
    res.status(200).json({
      success: true,
      message: "Testinomial deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error on updating please try again later",
    });
  }
};

module.exports = {
  fetchTestimonial,
  postTestimonial,
  deleteTestimonial,
};
