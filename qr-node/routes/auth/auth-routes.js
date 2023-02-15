const express = require('express');
const authControllers = require('../../controllers/auth/auth-controller')

const router = express.Router();

router.post("/:id/create/:id/super", authControllers.createSuperAdmin);

router.post("/login", authControllers.loginAccount);

router.post("/passwordReset", authControllers.forgotPassword);

router.post("/resetPassword", authControllers.resetPassword);

module.exports = router;

