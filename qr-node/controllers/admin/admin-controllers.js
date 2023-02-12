const qr = require("qrcode");

// const bcrypt = require("bcryptjs/dist/bcrypt");
// const jwt = require("jsonwebtoken");
const { getDb } = require("../../database/mongoConnect");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const ejs = require("ejs");
const res = require("express/lib/response");

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


const UniqueCode = 100000 + Math.floor(Math.random() * 900000).toString();
exports.createMember = async (req, res, next) => {
  const db = await getDb();
  try {
    const { firstName, lastName, email } = req.body;
    

    const data = {
      firstName,
      email,
      lastName
    }
    const result = await db.collection("membersList").insertOne(data);
    console.log(result);
    const userId = result?.insertedId.toString()
    console.log(userId)
    generateQRCode(userId, email, res)
  } catch (err) {
    console.log("Something went wrong. Please try again");
  }
};

// Generate QR code

const generateQRCode = async (urlId, receiver, res) => {
  // const url = req.body.url;
  // If the input is null return "Empty Data" error
  if (urlId.length === 0) res.send("Empty Data!");

  // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
  // It shall be returned as a png image format
  // In case of an error, it will save the error inside the "err" variable and display it

  var opts = {
    errorCorrectionLevel: "H",
    type: "image/jpeg",
    quality: 0.3,
    margin: 1,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF",
    },
    width: "300",
    height: "300",
  };
  qr.toDataURL(urlId, opts, (err, src) => {
    if (err) res.send("Error occured");
    // Let us return the QR code image as our response and set it to be the source used in the webpage
    // res.render("scan", { src });
    sendEmail(receiver, src, res);
  });
};

// send QR code as email
const sendEmail = async (receiver, src, res) => {
  
  ejs.renderFile("views/welcome.ejs", 
    { receiver, src },
    (err, data) => {
      if (err) {
        console.log(err)
        return res.status(400).json({
          statusId: "FAILED",
          message: "Something went wrong!!",
        });
      }
      try {
        const mailOptions = {
          from: "corporateacc701@gmail.com",
          to: receiver,
          subject: "New QR code for Attendance",
          html: data,
          attachments: [{
              filename: 'image.png',
              path: src,
              cid: 'unique@kreata.ee' //same cid value as in the html img src
          }]
          
        
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
        res.status(200).json({statusId: 'SUCCESS', message: 'Email QR-code has been sent'})
      } catch (err) {
        console.log(err);
        res.status(400).json({
          statusId: "FAILED",
          message: "An error occured, Try again later!.!",
        });
      }
    }
  );
};



// Delete below
// POST departments
exports.createData = async (req, res, next) => {
  const db = getDb();
  const { department, courses } = req.body;

  // check if Department exist
  const reg_Data = await db
    .collection("userData")
    .findOne({ department: department });
  if (reg_Data) {
    return res.status(400).json({
      message: "Department already exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  const new_Item = { department, courses };
  try {
    const send_Data = await db.collection("userData").insertOne(new_Item);
    console.log(send_Data);
    res.status(201).json({ message: "Content Added", statusId: "SUCCESS" });
  } catch (err) {
    console.log(err);
  }
};

exports.getDepartment = async (req, res, next) => {
  const db = getDb();
  try {
    // fetch all department from db
    const deptList = await db.collection("userData").find().toArray();
    const listData = await deptList;
    res.status(200).json({ message: "Departments gotten", response: listData });
  } catch (err) {
    res.status(501).json({ message: "Getting Departments Failed.! " });
  }
};

// Edit Departments
exports.editDept = async (req, res, next) => {
  const updateValues = req.body;
  const id = req.params.uid;
  const db = getDb();

  // check if department exist
  const checkUser = await db
    .collection("userData")
    .findOne({ _id: new mongodb.ObjectId(id) });

  if (!checkUser) {
    return res.status(400).json({
      message: " This Department does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  try {
    const sendUpdate = await db
      .collection("userData")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { ...updateValues } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Department Updated", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};

// delete department
exports.deleteDepartment = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  try {
    await db.collection("userData").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Removed Department" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", statusId: "SERVER ERROR" });
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
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete User Error", statusId: "SERVER ERROR" });
  }
};

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
