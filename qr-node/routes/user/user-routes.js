const express = require('express');
const userControllers = require('../../controllers/user/user-controllers');
const { check } = require("express-validator");
const { validateUserUpdate } = require('../../middleware/userValidation')

const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.get("/getUser/:uid", userControllers.findUserbyId);

router.get("/attendanceList", userControllers.getAllAttendance);

router.post("/create", validateUserUpdate, userControllers.createUser)

router.post("/attendance", userControllers.createAttendance);
    
router.patch("/closeAtt/:uid", userControllers.closeAttendance);


 
module.exports = router;