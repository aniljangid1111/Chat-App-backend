// const express = require('express')
// var cors = require('cors')
// require('dotenv').config()
// const allRoutes = require('./src/app.js')
// require('./src/config/db.js')

// const app = express()
// const PORT = process.env.PORT;
// app.use(express.urlencoded())
// app.use(express.json())
// app.use(cors())

// app.use('/uploads', express.static('uploads'));


// app.use('/api', allRoutes)


// app.listen(PORT, (() => {
//     console.log(`server Start on PORT ${PORT}`)
// }))

const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const allRoutes = require("./src/app.js");
require("./src/config/db.js");
const { Server } = require("socket.io");
const User = require("./src/models/user.js");
const initSocket = require("./src/socket/socket.js");


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use("/api", allRoutes);

// Initialize Socket.IO
initSocket(server, app);

server.listen(PORT, () => {
    console.log(`Server Start on PORT ${PORT}`);
});