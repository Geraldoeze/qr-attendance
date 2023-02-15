const qr = require("qrcode");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const sendMailHandler = require('./sendEmail');
const transporter = sendMailHandler();

const generateQRCodeImage = async (urlId, email, res) => {
    // If the input is null return "Empty Data" error
    if (urlId.length === 0) res.send("Empty Data!");
  
    // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
    // It shall be returned as a jpeg image format
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

     sendEmail(email, src, res);
    });
    
  };
  
  // send QR code as email
  const sendEmail = async (email, src, res) => {
    ejs.renderFile("views/welcome.ejs", { email, src }, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          statusId: "FAILED",
          message: "Something went wrong!!",
        });
      }
      try {
        const mailOptions = {
          from: "corporateacc701@gmail.com",
          to: email,
          subject: "New QR code for Attendance",
          html: data,
          attachments: [
            {
              filename: "image.png",
              path: src,
              cid: "unique@kreata.ee", //same cid value as in the html img src
            },
          ],
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });
        // res
        //   .status(200)
        //   .json({ statusId: "SUCCESS", message: "Email QR-code has been sent" });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          statusId: "FAILED",
          message: "An error occured, Try again later!.!",
        });
      }
    });
  };
  
module.exports = generateQRCodeImage;