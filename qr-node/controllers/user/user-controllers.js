const { validationResult } = require("express-validator");
const { getDb } = require("../../database/mongoConnect");

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../../models/user");
const generateQRCodeImage  = require("../../utils/generateQR");

const bcrypt = require("bcryptjs/dist/bcrypt");
// const jwt = require("jsonwebtoken");

const UniqueCode = 100000 + Math.floor(Math.random() * 900000).toString();


exports.createUser = async (req, res, next) => {
  const db = await getDb();
  try {                 
    const { firstName, lastName, email, gender, id, origin, address, contact, area, password, status, dob } = req.body;

    //   Check if Email  exist
    const user_Email = await db.collection("users").findOne({ email: email });
    if (user_Email) {
      //  A user exists with this email,
      return res.status(400).json({
        statusId: "Email Exists",
        message: "Email Address exists on a User's account, Kindly login. !!!",
      });
    }
    // bcrypt password
    const hashedPassword = await bcrypt.hash(password, 12);
    // get image from path
    const image = req.file.path;
    // save user data to user database model
    const UserData = new User( firstName, lastName, email, gender, id, origin, address, contact, area, hashedPassword, status, dob, image);
    const saveUserData = await UserData.saveToDB();
    const userId = saveUserData?.insertedId.toString();
    
    await generateQRCodeImage(userId, email, res);
    res.status(201).json({ message: "Users Created, Kindly Check Email address", response: saveUserData });
  } catch (err) {
    console.log("Something went wrong. Please try again");
  }
};
 
 

exports.getAllUsers = async (req, res, next) => {
  try {
    // fetch all users from db
    const allUsers = await User.getAllUsers();
    res.status(200).json({ message: "Users gotten", response: allUsers });
  } catch (err) {
    res.status(501).json({ message: "Getting Users Failed.!! " });
  }
};


exports.findUserbyId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    // find user from db
    const user = await User.findById(userId);
    res.status(200).json({ message: "User gotten", response: [user] });
  } catch (err) {
    res.status(501).json({ message: "Getting Users Failed.!! " });
  }
};


exports.updateUser = async (req, res, next) => {
  const updateValues = req.body;
  const id = req.params.uid;
  const db = getDb();

  // check if user exists
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(id) });

  if (!checkUser) {
    return res.status(400).json({
      message: " User Id does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }

  try {
    const sendUpdate = await db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { ...updateValues } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Users Updated", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  if(req.type_Value == "users" ) {
    return res.status(400).json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete User Error", statusId: "SERVER ERROR" });
  }
};
