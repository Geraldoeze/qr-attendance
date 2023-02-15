const nodemailer = require("nodemailer");


const sendMailHandler = () => {

// nodemailer Treans
const transporter = nodemailer.createTransport({
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
    // console.log(success);
    // console.log("Ready to send email");
  }
})
return transporter;
}

module.exports = sendMailHandler;  