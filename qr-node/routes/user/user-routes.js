const express = require('express');
const userControllers = require('../../controllers/user/user-controllers');
const auth = require("../../middleware/auth");
const { validateUserUpdate } = require('../../middleware/userValidation');
const fileUpload = require("../../middleware/file-upload");

const router = express.Router();

router.get("/", auth, userControllers.getAllUsers);

router.get("/getuser/:uid", auth, userControllers.findUserbyId);

router.post("/create", fileUpload.single("image"), validateUserUpdate, userControllers.createUser);

router.put("/update/:uid", auth, validateUserUpdate, userControllers.updateUser);

router.delete("/delete/:uid", auth, userControllers.deleteUser);

 
module.exports = router;