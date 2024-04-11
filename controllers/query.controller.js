const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const queryModel = require("../models/query.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};

//fetch query
const fetchQuery = async (req, res) => {
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
    const querys = await studentModel
      .findById(decodedToken.id)
      .populate("query");

    res.status(200).json(querys.query);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting query
const postQuery = async (req, res) => {
  try {
    //getting body content
    const { queryTitle, queryDesc } = req.body;

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
    //getting logged student to store query
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into query collection
    const newQuery = new queryModel({
      queryTitle,
      queryDesc,
      student: student._id,
    });

    //saving new query in collection
    const savedQuery = await newQuery.save();

    //loading query id to student collection
    student.query = student.query.concat(savedQuery._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Query applied successfully",
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

//deleting query

const deleteQuery = async (req, res) => {
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
    //if query not found throw error
    const matchedQuery = await queryModel.findById(id);
    if (!matchedQuery) {
      return res.status(401).json({
        message: "Query data not found",
      });
    }
    //deleting query from collection
    await queryModel.findByIdAndDelete(id);

    //removing from student db
    await studentModel.findByIdAndUpdate(
      decodedToken.id,
      {
        $pull: { query: id },
      },
      { new: true }
    );

    //sending response
    res.status(200).json({
      success: true,
      message: "Query deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error on updating please try again later",
    });
  }
};

module.exports = {
  fetchQuery,
  postQuery,
  deleteQuery,
};
