const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = require('http').createServer(app);
const cors = require("cors");

const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");
const userRoute = require("./routes/user");
const transferRoute = require("./routes/transfer");
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const db = require("./helper/DB");

const io = socketio(server);
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
let interval;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.get("/", (req, res) => {
  console.log(io.on('connected',()=>{}));
  res.send({
    msg: "server online",
  });
});

//topup route
app.use("/api/v1/topup", toupupRoute);
//user route
app.use("/api/v1/user", userRoute);
//transfers route
app.use("/api/v1/transfer", transferRoute);
//auth
app.use("/api/v1/auth", authRoute);
//upload
app.use("/api/v1/upload", uploadRoute);

io.on("connection",(socket) => {
  const uuid = socket.handshake.query.uuid;
  console.log("new client connected uuid", uuid);
  socket.join(uuid);
})


server.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});
