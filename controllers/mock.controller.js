const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const mockModel = require("../models/mock.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};

//fetch all mock data
const fetchMock = async (req, res) => {
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
    const mocks = await studentModel.findById(decodedToken.id).populate("mock");

    res.status(200).json(mocks.mock);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting new mock data
const postMock = async (req, res) => {
  try {
    //getting body content
    const {
      interviewDate,
      interviewerName,
      interviewRound,
      comments,
      logicalScore,
      overallScore,
    } = req.body;

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

    //getting logged student to store mock
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into mock collection
    const newMock = new mockModel({
      interviewDate,
      interviewerName,
      interviewRound,
      comments,
      logicalScore,
      overallScore,
      student: student._id,
    });

    //saving new mock in collection
    const savedMock = await newMock.save();

    //loading mock id to student collection
    student.mock = student.mock.concat(savedMock._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Mock submitted successfully",
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
  fetchMock,
  postMock,
};
