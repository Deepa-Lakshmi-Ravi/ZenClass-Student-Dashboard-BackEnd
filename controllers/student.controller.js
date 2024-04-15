const studentModel = require("../models/student.model");
const auth = require("../Public/auth");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

dotenv.config();

const SignUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNo,
      qualification,
      experience,
      password,
      confirmPassword,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNo ||
      !qualification ||
      !experience ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const ExistUser = await studentModel.findOne({ email });
    if (ExistUser) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }
    const hashedPassword = await auth.hashPassword(password);
    const newUser = new studentModel({
      firstName,
      lastName,
      email,
      contactNo,
      qualification,
      experience,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Student = await studentModel.findOne({ email });
    if (!Student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const validPassword = await auth.hashCompare(password, Student.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
    const token = await auth.createToken({
      id: Student._id,
      firstName: Student.firstName,
      lastName: Student.lastName,
      email: Student.email,
    });
    const studentData = await studentModel.findOne(
      { email: req.body.email },
      { password: 0 }
    );
    res.status(201).json({
      success: true,
      message: "Login successful",
      token,
      studentData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      contactNo,
      qualification,
      experience,
      password,
      noticePeriod,
      yearofpassing,
      portfolioUrl,
      githubUrl,
      resumeUrl,
    } = req.body;

    //find the student by email
    const matchedstudent = await studentModel.findOne({ email });

    //If student not found return error
    if (!matchedstudent) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid email",
      });
    }
    //hash the password if provided
    let hashedPassword = matchedstudent.password;
    if (password) {
      hashedPassword = await auth.hashPassword(password);
    }

    //update student object
    (matchedstudent.firstName = firstName),
      (matchedstudent.lastName = lastName),
      (matchedstudent.email = email),
      (matchedstudent.contactNo = contactNo),
      (matchedstudent.qualification = qualification),
      (matchedstudent.experience = experience),
      (matchedstudent.password = hashedPassword),
      (matchedstudent.yearofpassing = yearofpassing),
      (matchedstudent.noticePeriod = noticePeriod),
      (matchedstudent.portfolioUrl = portfolioUrl),
      (matchedstudent.githubUrl = githubUrl),
      (matchedstudent.resumeUrl = resumeUrl),
      //update the student in the database
      await studentModel.findByIdAndUpdate(matchedstudent._id, matchedstudent);

    //response with success message
    res.status(201).json({
      success: true,
      message: "Account updated successfully",
      matchedstudent,
    });
  } catch (err) {
    //Handle errors
    console.error(err);
    res.status(400).json({
      message: "Error on updating please try again later",
    });
  }
};

const ForgetPassword = async (req, res) => {
  try {
    const student = await studentModel.findOne({ email: req.body.email });
    if (student) {
      const randomString = randomstring.generate({
        length: 10,
        charset: "alphanumeric",
      });
      const expirationTimestamp = Date.now() + 2 * 60 * 1000;

      console.log(expirationTimestamp);

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${randomString}/${expirationTimestamp}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_ID,
        to: student.email,
        subject: "Password Reset",
        html: `
        <h3>Password Change Request</h3>
        <p>Click on the below link to reset your password</p>
        <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; cursor:pointer;">Set Your New Password</a>
        `,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send({
            message: "Failed to send the password reset mail",
          });
        } else {
          console.log("Password reset mail sent", +info.response);
          try {
            student.randomString = randomString;
            await student.save();
            res.status(201).send({
              message:
                "Password reset mail sent successfully.Random string updated in the database.",
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({
              message: "Failed update random string in the database",
            });
          }
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { randomString, expirationTimestamp } = req.params;

    const student = await studentModel.findOne({ randomString: randomString });
    if (!student || student.randomString !== randomString) {
      return res.status(400).send({
        message: "Invalid Random String",
      });
    }

    if (expirationTimestamp && expirationTimestamp < Date.now()) {
      return res.status(400).send({
        message:
          "Expiration token has expired. Please request a new reset link.",
      });
    } else {
      if (req.body.newPassword) {
        const newPassword = await auth.hashPassword(req.body.newPassword);

        student.password = newPassword;
        student.randomString = null;
        await student.save();

        return res.status(200).send({
          message: "Your new password has been updated successfully",
        });
      } else {
        return res.status(400).send({
          message:
            "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = {
  SignUp,
  SignIn,
  updateStudentProfile,
  ForgetPassword,
  ResetPassword,
};
