const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const { getDb } = require("../../database/mongoConnect");
const sendMailHandler = require("../../utils/sendEmail");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const transporter = sendMailHandler();

// SUPER ADMIN signUp
exports.createSuperAdmin = async (req, res, next) => {
  const db = await getDb();
  const { email, password, firstName, lastName } = req.body;
  try {
    // check if super admin already exist with email and username.
    const oldUser = await db
      .collection("superAdmin")
      .find({ $or: [{ email: email }, { lastName: lastName }] });
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
        } else if (elem.lastName === lastName) {
          message = "LastName already used";
          return false;
        }
      });
      if (message.length != 0)
        return res.status(400).json({ message, statusId: "FAILED!!" });
    }
      // creating new superAdmin
      const hashedPassword = await bcrypt.hash(password, 12);

      const data = {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        type: 'superAdmin'
      };
      const result = await db.collection("superAdmin").insertOne(data);
      console.log(result);
      res.status(200).json({message: "Created Super"})
  } catch (err) {
    console.log("Super Admin Something went wrong. Please try again");
  }
};

// use some contents f
exports.signupAdmin = async (req, res, next) => {
  const db = await getDb();
  try {
    const { email, password, name, adminNumber } = req.body;
    console.log(email, name, password);

    //  adminNumber Verification

    const signUpCode = 100000 + Math.floor(Math.random() * 900000);
    const code = signUpCode.toString();
    await db.collection("signUpToken").insertOne({ adminNumber: code });
    // return res.json({message: "inserted"})

    const signUpToken = await db
      .collection("signUpToken")
      .findOne({ adminNumber: adminNumber });

    if (!signUpToken) {
      return res
        .status(400)
        .json({
          message: "Admin Number is not correct. Contact Administrator!",
        });
    }
    await db.collection("signUpToken").deleteOne({ adminNumber: adminNumber });

    // Validate user input
    if (!(email && password && name)) {
      return res.status(403).json({
        message: "All input fields are required!",
        statusId: "CHECK INPUTS",
      });
    }

    // check if user already exist with email and username.
    const oldUser = await db
      .collection("admin")
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
    const result = await db.collection("admin").insertOne(data);
    console.log(result);
  } catch (err) {
    console.log("Something went wrong. Please try again");
  }
};

exports.loginAccount = async (req, res, next) => {
  const db = getDb();
  try {
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res
        .status(400)
        .json({ message: "All input is required", statusId: "FAILED" });
    }
    // checking superAdmin db
    const superAdmin_content = await db
      .collection("superAdmin")
      .findOne({ email: email });
    if (superAdmin_content) {
      try {
        // comparing password
        const isPasswordCorrect = await bcrypt.compare(
          password,
          superAdmin_content.password
        );
        if (!isPasswordCorrect)
          return res.status(400).json({
            message: "Incorrect Password!!",
            statusId: "FAILED",
          });
        // setting up token
        const token = jwt.sign(
          {
            userId: superAdmin_content._id.toString(),
            type: superAdmin_content.type,
          },
          process.env.JSONWEB_TOKEN,
          { expiresIn: "6h" }
        );
        return res.status(200).json({
          message: "Login successful",
          statusId: "SUCCESS!",
          token: token,
          userDetails: superAdmin_content,
        });
      } catch (err) {
        res.status(501).json({
          message: "Error Verifying superAdmin !!",
          statusId: "FAILED",
        });
      }
    }

    // checking admin db
    const admin_content = await db
      .collection("admin")
      .findOne({ email: email });
    if (admin_content) {
      try {
        // comparing password
        const isPasswordCorrect = await bcrypt.compare(
          password,
          admin_content.password
        );
        if (!isPasswordCorrect)
          return res.status(400).json({
            message: "Incorrect Password!!",
            statusId: "FAILED",
          });
        // setting up token
        const token = jwt.sign(
          { userId: admin_content._id.toString(), type: admin_content.type },
          process.env.JSONWEB_TOKEN,
          { expiresIn: "6h" }
        );
        return res.status(200).json({
          message: "Login successful",
          statusId: "SUCCESS!",
          token: token,
          userDetails: admin_content,
        });
      } catch (err) {
        res.status(501).json({
          message: "Error Verifying Admin !!",
          statusId: "FAILED",
        });
      }
    }

    // checking user db
    const user_content = await db.collection("users").findOne({ email: email });
    if (user_content) {
      try {
        // comparing password
        const isPasswordCorrect = await bcrypt.compare(
          password,
          user_content.password
        );
        if (!isPasswordCorrect)
          return res.status(400).json({
            message: "Incorrect Password!!",
            statusId: "FAILED",
          });
        // setting up token
        const token = jwt.sign(
          { userId: user_content._id.toString(), type: user_content.type },
          process.env.JSONWEB_TOKEN,
          { expiresIn: "6h" }
        );
        return res.status(200).json({
          message: "Login successful",
          statusId: "SUCCESS!",
          token: token,
          userDetails: user_content,
        });
      } catch (err) {
        res.status(501).json({
          message: "Error Verifying User !!",
          statusId: "FAILED",
        });
      }
    }

    if (!superAdmin_content && !admin_content && !user_content) {
      return res.status(501).json({
        message: "Login Details does not exist on database!!",
        statusId: "UNKNOWN",
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
    return res.status(400).json({
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
      return res.status(400).json({
        message: "Password reset request not found.",
        statusId: "STRANGE",
      });
    }
  } catch (err) {}
};
