const { validationResult } = require("express-validator");
const { getDb } = require("../../database/mongoConnect");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../../models/user");
const req = require("express/lib/request");

exports.getAllUsers = async (req, res, next) => {
  try {
    // fetch all users from db
    const allUsers = await User.getAllUsers();
    res.status(200).json({ message: "Users gotten", response: allUsers });
  } catch (err) {
    res.status(501).json({ message: "Getting Users Failed.!! " });
  }
};

exports.createUser = async (req, res, next) => {
  const db = await getDb();

  // const RandomId = 100000 + Math.floor(Math.random() * 900000);
  
  
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      id,
      matric,
      origin,
      department,
      courses,
      address,
      contact,
      levelId, ninNumber, country
    } = req.body;

    //   Check if RegId  exist
    const _regUser = await db
      .collection("users")
      .findOne({ matric: matric });

    if (_regUser) {
      //  A user exists with this RegId,
      return res.status(400).json({
        statusId: "Matric No",
        message: "Matric No exists already, change it or Try again. !!!",
      });
    }

    // save user data to user database model
    const UserData = new User(
      firstName,
      lastName,
      email,
      gender,
      id,
      matric,
      origin,
      department,
      courses,
      address,
      contact, levelId, ninNumber, country
    );
    const saveUserData = await UserData.saveToDB();

    res.status(201).json({ message: "Users Created", response: saveUserData });
  } catch (err) {
    console.log(err);
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

exports.getAllAttendance = async (req, res, next) => {
  const db = await getDb();
  try {
    const attendanceList = await db.collection("attendance").find().toArray();
    const list = await attendanceList;
    res
      .status(201)
      .json({
        message: "Attendance Fetched",
        statusId: "SUCCESS",
        response: list,
      });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({
        message: "Failed to fetch Attendance List",
        statusId: "UNSUCCESSFUL",
      });
  }
};

exports.createAttendance = async (req, res, next) => {
  const db = await getDb();
  const { department, course, lecturer, refinedDate, location, attValue, attendance } =
    req.body;
  const new_Item = {
    department,
    course,
    lecturer,
    refinedDate,
    location,
    attValue,
    attendance
  };
  try {
    const send_Data = await db.collection("attendance").insertOne(new_Item);
    console.log(send_Data);
    res.status(201).json({ message: "Attendance Added", statusId: "SUCCESS" });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({
        message: "Failed to create Attendance",
        statusId: "UNSUCCESSFUL",
      });
  }
};

exports.closeAttendance = async (req, res, next) => {
  const db = getDb();
  const userId = req.params.uid.trim();

  // check if attendance exist
  const checkAtt = await db
    .collection("attendance")
    .findOne({ _id: ObjectId(userId) });
console.log(checkAtt, userId)
  if (!checkAtt) {
    return res 
      .status(400)
      .json({
        message: " This Attendance does not exists.!",
        statusId: "UNSUCCESSFUL",
      });
  }
  try { 
    const attVal = "close";
    const sendUpdate = await db
      .collection("attendance")
      .updateOne(
        { _id: new mongodb.ObjectId(userId) },
        { $set: { attValue: attVal } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Attendance Closed ", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};
