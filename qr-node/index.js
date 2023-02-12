const express = require("express");
const bodyParser = require("body-parser");
const Server = require('http');
const qr = require("qrcode");
const createServer = Server.createServer;
const mongoConnect = require('./database/mongoConnect').mongoConnect;

const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/admin-routes");

const userRoutes = require("./routes/user/user-routes");


const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const { createMember } = require("./controllers/admin/admin-controllers");
const PORT = 7000;
require("dotenv").config();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(bodyParser.json());

// app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// app.use("/users", userRoutes);

// app.get("/", (req, res) => {
//     res.render("index");
// });

// app.post("/scan", createMember);

mongoConnect(() => {
    app.listen(PORT);
})

//  // If the input is null return "Empty Data" error
//  if (url.length === 0) res.send("Empty Data!");
    
//  // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
//  // It shall be returned as a png image format
//  // In case of an error, it will save the error inside the "err" variable and display it
 
//  var opts = {
//      errorCorrectionLevel: 'H',
//      type: 'image/jpeg',
//      quality: 0.3,
//      margin: 1,
//      color: {
//        dark:"#010599FF",
//        light:"#FFBF60FF"
//      },
//      width: '300',
//      height: '300'
//    }
//  qr.toDataURL(url, opts, (err, src) => {
//      if (err) res.send("Error occured");
   
//      // Let us return the QR code image as our response and set it to be the source used in the webpage
//      res.render("scan", { src });
//  });