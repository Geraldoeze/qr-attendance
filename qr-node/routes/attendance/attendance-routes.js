const express = require('express');
const attControllers = require("../../controllers/attendance/attendance-controllers");
const auth = require("../../middleware/auth");


const router = express.Router();

router.get("/", auth, attControllers.getAllAttendance);

router.post("/create", auth, attControllers.createAttendance);

router.post("/getminister/:uid/:aid", auth, attControllers.getMinisterbyId)

router.patch("/closeatt/:uid", auth, attControllers.closeAttendance);

router.delete("/delete/:uid", auth, attControllers.deleteAttendance);

 
module.exports = router;