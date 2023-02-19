const qr = require("qrcode");
const bcrypt = require("bcryptjs/dist/bcrypt");
// const jwt = require("jsonwebtoken");
const { getDb } = require("../../database/mongoConnect");

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const UniqueCode = 100000 + Math.floor(Math.random() * 900000).toString();

// GET Attendance
exports.getAllAttendance = async (req, res, next) => {
  const db = await getDb();
  try {
    const attendanceList = await db.collection("attendance").find().toArray();
    const list = await attendanceList;
    res.status(201).json({
      message: "Attendance Fetched",
      statusId: "SUCCESS",
      response: list,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to fetch Attendance List",
      statusId: "UNSUCCESSFUL",
    });
  }
};

// POST user by
exports.getMinisterbyId = async (req, res, next) => {
  const db = getDb();
  const userId = req.params.uid.trim();
  const attId = req.params.aid.trim();
console.log(attId)
  // first check if userId exist on our db
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(userId) });

  if (!checkUser) {
    return res.status(400).json({
      message: "Minister does not exists.!",
      statusId: "UNSUCCESSFUL", 
    });
  }
  const getAtt = await db
    .collection("attendance")
    .findOne({ _id: new mongodb.ObjectId(attId) });

  //  check if the user has taken attendance already
  // const checkUserAtt = await db
  //   .collection("attendance")
  //   .find({ _id: getAtt._id, attendance: { $in: [checkUser] } })
  //   .count();
  // if (checkUserAtt >= 1) {
  //   return res.status(400).json({
  //     message: "Minister has already taken attendance",
  //     statusId: "WRONG",
  //   });
  // }
  try {
    // update attendance list
    // const id = getAtt._id;
    // console.log(id)
    // const attendanceUpdate = [...getAtt.attendance, checkUser];
    // await db
    //   .collection("attendance")
    //   .updateOne(
    //     { _id: new mongodb.ObjectId(id) },
    //     { $set: { attendance: attendanceUpdate } }
    //   );
    res.status(200).json({
      message: "Minister Attendance Recorded",
      statusId: "CONFIRMED",
      response: checkUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error while recording attendance",
      statusId: "FAILED",
    });
  }
};

// POST Attendance
exports.createAttendance = async (req, res, next) => {
  const db = await getDb();
  const {
    creator,
    event,
    time,
    refinedDate,
    place,
    access,
    attValue,
    attendance,
  } = req.body;
  const new_Item = {
    creator,
    eventtitle: event,
    time,
    refinedDate,
    place,
    access,
    attValue,
    attendance,
  };
  try {
    const send_Data = await db.collection("attendance").insertOne(new_Item);
    console.log(send_Data);
    res.status(201).json({ message: "Attendance Added", statusId: "SUCCESS" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to create Attendance",
      statusId: "UNSUCCESSFUL",
    });
  }
};

// PATCH Close Attendance
exports.closeAttendance = async (req, res, next) => {
  const db = getDb();
  const userId = req.params.uid.trim();

  // check if attendance exist
  const checkAtt = await db
    .collection("attendance")
    .findOne({ _id: ObjectId(userId) });
  console.log(checkAtt, userId);
  if (!checkAtt) {
    return res.status(400).json({
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

// DELETE Attendance
exports.deleteAttendance = async (req, res, next) => {};
