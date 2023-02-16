const qr = require("qrcode");
const bcrypt = require("bcryptjs/dist/bcrypt");
// const jwt = require("jsonwebtoken");
const { getDb } = require("../../database/mongoConnect");

const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const Admin = require("../../models/admin");
const ObjectId = mongodb.ObjectId;

const UniqueCode = 100000 + Math.floor(Math.random() * 900000).toString();

// GET Events
exports.getAllEvents = async (req, res, next) => {
  const db = getDb();
  try {
    const eventList = await db.collection("events").find().toArray();
    const list = await eventList;
    res.status(201).json({
      message: "Events Fetched",
      statusId: "SUCCESS",
      response: list,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to fetch Events",
      statusId: "UNSUCCESSFUL",
    });
  }
};

// POST Events
exports.createEvent = async (req, res, next) => {
  const db = getDb();
  const { date, eventFunction } = req.body;
  // check if event exist
  const reg_Event = await db
    .collection("events")
    .findOne({ eventFunction: eventFunction });
  if (reg_Event) {
    return res.status(400).json({
      message: "Event already exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  const new_Event = { date, eventFunction };
  try {
    const send_Data = await db.collection("events").insertOne(new_Event);
    console.log(send_Data);
    res.status(201).json({ message: "Event Added", statusId: "SUCCESS" });
  } catch (err) {
    console.log(err);
  }
};

// DELETE Event
exports.deleteEvent = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  try {
    await db.collection("events").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Removed Event" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", statusId: "SERVER ERROR" });
  }
};

// GET All admin
exports.getAllAdmins = async (req, res, next) => {
  const db = getDb();
  if (req.type_Value != "superAdmin") {
    return res
      .status(400)
      .json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }
  try {
    const adminList = await db.collection("admin").find().toArray();
    const list = await adminList;
    res.status(201).json({
      message: "Admins Fetched",
      statusId: "SUCCESS",
      response: list,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to fetch Admin",
      statusId: "UNSUCCESSFUL",
    });
  }
};

// GET ONE Admin
exports.getAdminById = async (req, res, next) => {
  const userId = req.params.uid;
  if (req.type_Value != "superAdmin") {
    return res
      .status(400)
      .json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }
  try {
    // find admin from db
    const adminData = await Admin.findById(userId);
    res.status(200).json({ message: "Admin gotten", response: [adminData] });
  } catch (err) {
    res.status(501).json({ message: "Getting Admin Failed.!! " });
  }
};

// POST Admin
exports.createAdmin = async (req, res, next) => {
  const db = getDb();
  if (req.type_Value != "superAdmin") {
    return res
      .status(400)
      .json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }
  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      id,
      address,
      contact,
      password,
      title,
      accessLevel,
      adminType,
    } = req.body;

    // check if user already exist with email and username.
    const oldUser = await db
      .collection("admin")
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
          message = "Lastname already used";
          return false;
        }
      });
      if (message.length != 0)
        return res.status(400).json({ message, statusId: "FAILED!!" });
    }

    // bcrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    // save adminData to admin database model
    const AdminData = new Admin(
      firstName,
      lastName,
      email,
      gender,
      id,
      address,
      contact,
      hashedPassword,
      title,
      accessLevel,
      adminType
    );
    const saveUserData = await AdminData.saveToDB();
    const adminId = saveUserData?.insertedId.toString();
    console.log(adminId, "NA Here");
    res
      .status(201)
      .json({ message: "Admin Created!!,", response: saveUserData });
  } catch (err) {
    console.log("Something went wrong. Please try again");
  }
};

// UPDATE Admin
exports.updateAdmin = async (req, res, next) => {
  const updateValues = req.body;
  const id = req.params.uid;
console.log(updateValues.accessLevel)

  if (req.type_Value != "superAdmin") {
    return res
      .status(400)
      .json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }

  const db = getDb();
  // check if admin exists
  const checkAdmin = await db
    .collection("admin")
    .findOne({ _id: new mongodb.ObjectId(id) });

  if (!checkAdmin) {
    return res.status(400).json({
      message: " Admin Id does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  try {
    const sendUpdate = await db
      .collection("admin")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { ...updateValues } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Admin Updated", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};

// DELETE Admin
exports.deleteAdmin = async (req, res, next) => {
  const db = getDb();
  const id = req.params.uid;
  if (req.type_Value != "superAdmin") {
    return res
      .status(400)
      .json({ message: "ACCESS DENIED", statusId: "UNAUTHORIZED" });
  }

  try {
    await db.collection("admin").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete Admin Error", statusId: "SERVER ERROR" });
  }
};

// QR COde verification
exports.getUserbyId = async (req, res, next) => {
  const db = getDb();

  const userId = req.params.uid;
  const { department, course } = req.body;

  // first check if userId exist on our db
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(userId) });

  if (!checkUser) {
    return res.status(400).json({
      message: " User Id does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }

  // Second we check if user registered the department
  if (checkUser?.department === department) {
    // He/She has this department registered in db
    // we update the attendance db to have this user details

    try {
      const attendanceList = await db
        .collection("attendance")
        .findOne({ course: course });
      if (!attendanceList) {
        return res.status(400).json({
          message: "This course is not registered on the database",
          statusId: "COURSE ERROR",
        });
      }

      // Check if the user has taken attendance already

      const checkUse = await db
        .collection("attendance")
        .find({ _id: attendanceList._id, attendance: { $in: [checkUser] } })
        .count();
      if (checkUse >= 1) {
        return res.status(400).json({
          message: "Student has already taken attendance",
          statusId: "WRONG",
        });
      }
      try {
        const id = attendanceList._id;
        const attendanceUpdate = [...attendanceList.attendance, checkUser];
        await db
          .collection("attendance")
          .updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: { attendance: attendanceUpdate } }
          );

        res.status(200).json({
          message: "User Attendance Recorded",
          statusId: "CONFIRMED",
          response: checkUser,
        });
      } catch (err) {
        res.status(400).json({
          message: "Error while recording attendance",
          statusId: "FAILED",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(400).json({
      message: "Student did not register this department",
      statusId: "WRONG",
    });
  }
};
