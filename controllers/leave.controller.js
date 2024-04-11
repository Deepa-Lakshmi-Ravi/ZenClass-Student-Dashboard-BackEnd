const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const leaveModel = require("../models/leave.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer")) {
    return authorization.replace("bearer", "");
  }
};

//fetch all leave data
const fetchLeave = async (req, res) => {
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
    const leaves = await studentModel
      .findById(decodedToken.id)
      .populate("leave");

    res.status(200).json(leaves.leave);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting new leave
const postLeave = async (req, res) => {
  try {
    //getting body content
    const { reason , appliedOn } = req.body;

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
    //getting logged student to store leave
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into leave collection
    const newLeave = new leaveModel({
      reason,
      appliedOn,
      student: student._id,
    });

    //saving new leave in collection
    const savedLeave = await newLeave.save();

    //loading leave id to student collection
    student.leave = student.leave.concat(savedLeave._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Leave applied successfully",
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

//deleting leave

const deleteLeave = async (req, res) => {
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
    //if leave not found throw error
    const matchedLeave = await leaveModel.findById(id);
    if (!matchedLeave) {
      return res.status(401).json({
        message: "Leave data not found",
      });
    }
    //deleting leave from collection
    await leaveModel.findByIdAndDelete(id);

    //removing from student db
    await studentModel.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { leave: id },
      },
      { new: true }
    );

    //sending response
    res.status(200).json({
      success: true,
      message: "Leave deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error on updating please try again later",
    });
  }
};

module.exports = {
  fetchLeave,
  postLeave,
  deleteLeave,
};
