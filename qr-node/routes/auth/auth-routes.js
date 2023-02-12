const express = require('express');
const authControllers = require('../../controllers/auth/auth-controller')

const router = express.Router();

router.get("/verify/:userId/:uniqueString", authControllers.verifyEmail);

router.post("/login", authControllers.loginAdmin);

router.post("/register", authControllers.signupAdmin);

router.post("/passwordReset", authControllers.forgotPassword);

router.post("/resetPassword", authControllers.resetPassword)

module.exports = router;

