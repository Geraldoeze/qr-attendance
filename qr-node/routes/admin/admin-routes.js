const express = require('express');
const adminControllers = require('../../controllers/admin/admin-controllers');
const {validateUserUpdate, validateDepartment} = require('../../middleware/userValidation');

const router = express.Router();

router.post("/create", adminControllers.createMember);


// delete these below
router.get("/getDept", adminControllers.getDepartment);

router.post("/getuserId/:uid", adminControllers.getUserbyId);

router.post("/createData", adminControllers.createData);

router.put("/editDept/:uid", validateDepartment, adminControllers.editDept);

router.put("/update/:uid", validateUserUpdate, adminControllers.updateUser);

router.delete("/deleteDept/:uid", adminControllers.deleteDepartment);

router.delete("/delete/:uid", adminControllers.deleteUser);


module.exports = router;