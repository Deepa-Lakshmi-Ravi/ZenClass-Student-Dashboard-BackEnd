const auth = require("../Public/auth");
const studentModel = require("../models/student.model");
const portfolioModel = require("../models/portfolio.model");

//getting token

const getToken = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
};

//fetch all portfolio
const fetchPortfolio = async (req, res) => {
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
    const portfolios = await studentModel
      .findById(decodedToken.id)
      .populate("portfolio");

    res.status(200).json(portfolios.portfolio);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error on fetching data please login & try again",
    });
  }
};

//posting new portfolio data
const postPortfolio = async (req, res) => {
  try {
    //getting body content
    const { portfolioUrl, githubUrl, resumeUrl } = req.body;

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

    //checking if already submitted
    const portfolios = await studentModel
      .findById(decodedToken.id)
      .populate("portfolio");

    if (portfolios.portfolio.length) {
      return res.status(401).json({
        message: "Already submitted",
      });
    }
    //getting logged student to store portfolio
    const student = await studentModel.findById(decodedToken.id);

    //prepare data to push into portfolio collection
    const newPortfolio = new portfolioModel({
      portfolioUrl,
      githubUrl,
      resumeUrl,
      student: student._id,
    });

    //saving new portfolio in collection
    const savedPortfolio = await newPortfolio.save();

    //loading portfolio id to student collection
    student.portfolio = student.portfolio.concat(savedPortfolio._id);

    await student.save();

    //sending response
    res.status(200).json({
      success: true,
      message: "Portfolio submitted successfully",
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
  fetchPortfolio,
  postPortfolio,
};
