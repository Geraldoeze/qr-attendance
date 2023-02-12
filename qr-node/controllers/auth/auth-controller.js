const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const { getDb } = require("../../database/mongoConnect");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

// nodemailer Treans
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

// test
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log(success);
    console.log("Ready for message");
  }
});

exports.signupAdmin = async (req, res, next) => {
  const db = await getDb();
  try {
    const { email, password, name, adminNumber } = req.body;
    console.log(email, name, password);

    //  adminNumber Verification

    const signUpCode = 100000 + Math.floor(Math.random() * 900000);
    const code = signUpCode.toString();
    await db.collection("signUpToken").insertOne({adminNumber: code})
    // return res.json({message: "inserted"})

    const signUpToken = await db
      .collection("signUpToken")
      .findOne({ adminNumber: adminNumber });
    
    if (!signUpToken) {
      return res.status(400).json({message: "Admin Number is not correct. Contact Administrator!"})
    }
    await db.collection("signUpToken").deleteOne({ adminNumber: adminNumber});

    // Validate user input
    if (!(email && password && name)) {
      return res
        .status(403)
        .json({
          message: "All input fields are required!",
          statusId: "CHECK INPUTS",
        });
    }

    // check if user already exist with email and username.
    const oldUser = await db
      .collection("userAdmin")
      .find({ $or: [{ email: email }, { name: name }] });
    const _inValidReg = await oldUser.toArray();
    if (_inValidReg.length > 0) {
      let message;
      _inValidReg.every((elem) => {
        if (
          elem.email.toString().trim().toLowerCase() ===
          email.toString().trim().toLowerCase()
        ) {
          message = "Email already used";
          return false;
        } else if (elem.name === name) {
          message = "Username already used";
          return false;
        }
      });
      if (message.length != 0)
        return res.status(400).json({ message, statusId: "FAILED!!" });
    }

    // creating new userAdmin
    const hashedPassword = await bcrypt.hash(password, 12);
   
    const data = {
      email: email,
      password: hashedPassword,
      name: name,
      emailVerified: false,
    };
    const result = await db.collection("userAdmin").insertOne(data);
    console.log(result);

    // send verification link to
    // sendVerificationEmail(data, result, res);
  } catch (err) {
    console.log("Something went wrong. Please try again");
  }
};

// send email for verification
const sendVerificationEmail = async ({ email }, { insertedId }, res) => {
  // extract _id from insertedId
  const id = insertedId.toString();
  const db = await getDb();
  // url to be used in the email verification
  const currentUrl = process.env.CURRENTURL;

  const uniqueString = uuidv4() + id;

  // mail options
  const mailOptions = {
    from: "flickyfeiveur7@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Verify Your Email", // Subject line
    html: `<p>Please verify your email address to complete the signup process and login into your account.</p>
            <p>This link <b>expires in 6 hours</b>.</p> <p>Press <a href=${
              currentUrl + "auth/verify/" + id + "/" + uniqueString
            }>here</a> to proceed.</p>`, // plain text body
  };

  // hash the password using bycrpt
  const saltRounds = 10;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(uniqueString, saltRounds);
  } catch (err) {
    res.status(400).json({
      statusId: "FAILED",
      message: "Something went wrong. Please try again!!!",
    });
  }
  // set values in userVerification collection
  const newVerification = {
    userId: id,
    uniqueString: hashedPassword,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000,
  };
  try {
    const saveUserVerify = await db
      .collection("userVerify")
      .insertOne(newVerification);
    console.log(saveUserVerify);
    const sendVerification = await transporter.sendMail(mailOptions);
    console.log(sendVerification, "Na here");
    res.status(202).json({
      statusId: "PENDING",
      message: "Verification email has been sent",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      statusId: "FAILED",
      message: "An error occured, Try again later!.!",
    });
  }
};

// verify email
// route = get currentUrl + /auth/verify/:userId/:uniqueString
exports.verifyEmail = async (req, res, next) => {
  const db = getDb();
  let { userId, uniqueString } = req.params;

  try {
    // find a user with the userId
    const getUser = await db.collection("userVerify").find({ userId: userId });
    const _ValidUser = await getUser.toArray();
    if (_ValidUser.length > 0) {
      let message;
      // user verification record exists
      const { expiresAt } = _ValidUser[0];
      const hashedUniqueString = _ValidUser[0].uniqueString;

      // checking for expired unique string
      if (expiresAt < Date.now()) {
        //  record has expired so we delete it
        const deleteUserVerify = await db
          .collection("userVerify")
          .deleteOne({ userId: userId });

        // delete user from userAdmin since he/she has not verified their email
        const deleteUser = await db
          .collection("userAdmin")
          .deleteOne({ _id: new ObjectId(userId) });
        console.log(deleteUser, deleteUserVerify);

        return res.status(400).json({
          statusId: "EXPIRED LINK",
          message: "LInk has expired. Please sign up again.",
        });
      } else {
        //    valid record exist, so we validate the user string
        // first compare the hashed unique string
        const uniqueID = await bcrypt.compare(uniqueString, hashedUniqueString);
        if (uniqueID) {
          // string match
          const response = await db
            .collection("userAdmin")
            .updateOne(
              { _id: new ObjectId(userId) },
              { $set: { emailVerified: true } }
            );
          await db.collection("userVerify").deleteOne({ userId: userId });

          console.log(response);
          return res.json({
            statusId: "SUCCESS",
            message: "Email has been verified. Kindly Login",
          });
        } else {
          // existing record but incorrect verification details passed
          return res.status(401).json({
            statusId: "UNKNOWN",
            message: "Incorrect Verification Link, Check Inbox again",
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusId: "FAILED",
      message: "Error occured when verifying User Server Error",
    });
  }
};

exports.loginAdmin = async (req, res, next) => {
  const db = getDb();
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res
        .status(400)
        .json({ message: "All input is required", statusId: "FAILED" });
    }
    const adminContent = await db
      .collection("userAdmin")
      .findOne({ email: email });
    if (!adminContent) {
      return res
        .status(400)
        .json({
          message: "Incorrect email or password.",
          statusId: "BAD REQUEST",
        });
    }

    try {
      // check if user is verified
      if (!adminContent.emailVerified) {
        return res.status(400).json({
          message: "Email has not been Verified!. Check your Inbox",
          statusId: "FAILED",
        });
      } else {
        // comparing password
        const isPasswordCorrect = await bcrypt.compare(
          password,
          adminContent.password
        );
        if (!isPasswordCorrect)
          return res.status(400).json({
            message: "Incorrect Password!!",
            statusId: "FAILED",
          });

        // setting up token
        const token = jwt.sign(
          { userId: adminContent._id.toString(), email: adminContent.email },
          process.env.JSONWEB_TOKEN,
          { expiresIn: "12h" }
        );
        return res.status(200).json({
          message: "LoginAdmin successful",
          statusId: "SUCCESS!",
          token: token,
          userDetails: adminContent,
        });
      }
    } catch (err) {
      res.status(501).json({
        message: "Error Verifying User !!",
        statusId: "FAILED",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const db = getDb();
  // add email and redirect so that when a user clicks the email, he will be redirected to the page
  const { email, redirectUrl } = req.body;

  const adminContent = await db
    .collection("userAdmin")
    .findOne({ email: email });
  const _regUser = await adminContent;

  if (_regUser) {
    // userAdmin exist

    // check if userAdmin is verified
    if (!_regUser.emailVerified) {
      return res.status(400).json({
        statusId: "FAILED",
        message: "Email has not been Verified. Check your inbox!!!",
      });
    } else {
      // proceed with email to reset password

      sendResetEmail(_regUser, redirectUrl, res);
    }
  } else {
    return res
      .status(400)
      .json({
        message: "Email does not exist on any Account.",
        statusId: "TRY AGAIN",
      });
  }
};

// send password reset email;
const sendResetEmail = async ({ _id, email }, redirectUrl, res) => {
  const db = getDb();
  const id = _id.toString();
  const resetString = uuidv4() + id;

  // First we clear all existing reset records
  await db.collection("passwordReset").deleteMany({ userId: id });
  // Reset records deleted successfuly
  // Now we send the email to reset the password

  // redirectUrl is gotten from the frontend, sent along with body
  const mailOptions = {
    from: "flickyfeiveur7@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Password Reset", // Subject line
    html: `<p>We heard you lost the password</p>
            <p>Don't worry, use the link below to reset it.</p>
            <p>This link <b>expires in 60 minute</b>.</p> <p>Press <a href=${
              redirectUrl + "/" + id + "/" + resetString
            }>here</a> to proceed.</p>`, // plain text body
  };

  // hash the reset string
  const saltRounds = 10;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(resetString, saltRounds);
  } catch (err) {
    res.status(400).json({
      statusId: "FAILED",
      message: "Something went wrong. Please try again!!!",
    });
  }
  // store the hashed values in the passwordReset collection
  const passReset = {
    userId: id,
    resetString: hashedPassword,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  };
  try {
    const savepassReset = await db
      .collection("passwordReset")
      .insertOne(passReset);
    console.log(savepassReset);
    const sendPasswordReset = await transporter.sendMail(mailOptions);
    console.log(sendPasswordReset);
    res.status(202).json({
      statusId: "PENDING",
      message: "Password Reset has been sent to Email",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      statusId: "FAILED",
      message: "An error occured, Try again later!.!",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const db = getDb();
  let { userId, resetString, newPassword } = req.body;
  console.log(resetString, newPassword, userId);
  try {
    const resetContent = await db
      .collection("passwordReset")
      .findOne({ userId: userId });
    if (resetContent) {
      // password record exist

      const { expiresAt } = resetContent.expiresAt;
      const hashedResetString = resetContent.resetString;

      // checking for expired reset string
      if (expiresAt < Date.now()) {
        const deleteReset = await db
          .collection("passwordReset")
          .deleteOne({ userId: userId });
        console.log(deleteReset);
        return res.status(401).json({
          statusId: "UNSUCCESSFUL",
          message: "Password reset link has expired!..",
        });
      } else {
        // valid reset record exists so we validate
        // first compare the hashed reset string

        let hashedString;
        try {
          hashedString = await bcrypt.compare(resetString, hashedResetString);
          if (hashedString) {
            // strings matched
            // hash password again

            const saltRounds = 10;
            let newHashedPassword;
            try {
              newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
              const result = await db
                .collection("userAdmin")
                .updateOne(
                  { _id: new ObjectId(userId) },
                  { $set: { password: newHashedPassword } }
                );

              // update complete
              await db
                .collection("passwordReset")
                .deleteOne({ userId: userId });

              // both user record and reset record updated..
              res.status(200).json({
                statusId: "SUCCESS",
                message:
                  "Password has been reset successfully!.. Kindly Log In.",
              });
              console.log(result);
            } catch (err) {
              res.status(501).json({
                statusId: "STRANGE",
                message: "An unknown Error occured at the Server.!",
              });
            }
          } else {
            // Existing record but incorrect reset string passed
            return res.status(401).json({
              statusId: "ERROR",
              message: "Invalid password reset details passed.",
            });
          }
        } catch (err) {}
      }
    } else {
      return res
        .status(400)
        .json({
          message: "Password reset request not found.",
          statusId: "STRANGE",
        });
    }
  } catch (err) {}
};
