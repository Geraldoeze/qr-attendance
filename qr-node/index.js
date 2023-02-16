const express = require("express");
const bodyParser = require("body-parser");
const Server = require('http');
const createServer = Server.createServer;
const mongoConnect = require('./database/mongoConnect').mongoConnect;
const path = require("path");


const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/admin-routes");
const userRoutes = require("./routes/user/user-routes");
const attRoutes = require("./routes/attendance/attendance-routes");


const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const PORT = 7000;
require("dotenv").config();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));


app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/users", userRoutes);
app.use("/attendance", attRoutes);

mongoConnect(() => {
    app.listen(PORT);
})
