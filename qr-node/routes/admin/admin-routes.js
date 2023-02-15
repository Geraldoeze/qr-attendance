const express = require('express');
const adminControllers = require('../../controllers/admin/admin-controllers');
const {validateUserUpdate, validateDepartment} = require('../../middleware/userValidation');
const auth = require("../../middleware/auth");

const router = express.Router();

router.get("/events", auth, adminControllers.getAllEvents);

router.get("/get", auth, adminControllers.getAllAdmins);

router.get("/single/admin/:uid", auth, adminControllers.getAdminById);

router.post("/events/create", auth, adminControllers.createEvent);

router.post("/create", auth, adminControllers.createAdmin);

router.put("/update/:uid", auth, adminControllers.updateAdmin);

router.delete("/delete/:uid", auth, adminControllers.deleteAdmin);

router.delete("/events/delete/:uid", auth, adminControllers.deleteEvent);


module.exports = router;