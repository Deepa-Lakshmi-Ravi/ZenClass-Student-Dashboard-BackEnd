const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const capstoneModel = require("../models/capstone.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};

//fetch all capstone data
const fetchCapstone = async (req, res) => {
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
    const capstones = await studentModel
      .findById(decodedToken.id)
      .populate("capstone");

    res.status(200).json(capstones.capstone);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting new capstone data
const postCapstone = async (req, res) => {
  try {
    //getting body content
    const { frontendCode, backendCode, frontendUrl, backendUrl } = req.body;

    //getting token
    const token = getToken(req);
    const decodedToken = await auth.decodeToken(token);

    //if token is not valid return error
    if (!decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: "Session timeout please login again",
      });
    }

    //check if already submitted
    const capstones = await studentModel
      .findById(decodedToken.id)
      .populate("capstone");

    if (capstones.capstone.length) {
      return res.status(401).json({
        message: "Already Submitted",
      });
    }

    //getting logged student to store capstone
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into capstone collection
    const newCapstone = new capstoneModel({
      frontendCode,
      backendCode,
      frontendUrl,
      backendUrl,
      student: student._id,
    });

    //saving new capstone in collection
    const savedCapstone = await newCapstone.save();

    //loading capstone id to student collection
    student.capstone = student.capstone.concat(savedCapstone._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Capstone submitted successfully",
    });
  } catch (err) {
    //Handle error
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Error on updating data please try again later",
    });
  }
};

module.exports = {
  fetchCapstone,
  postCapstone,
};
