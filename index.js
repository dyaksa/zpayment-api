const express = require("express");
const app = express();
const server = require('http').createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");
const userRoute = require("./routes/user");
const transferRoute = require("./routes/transfer");
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const dotenv = require("dotenv").config();
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.get("/", (req, res) => {
  res.send({
    msg: "server online"
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

app.use('*',cors());

io.on('connection',(socket) => {
  const itemId = socket.handshake.query.itemId
  console.log("user-connect", itemId);
  socket.join(itemId);
  socket.on('new-chat',(chat) => {
    console.log(itemId);
    socket.broadcast.to(itemId).emit('refresh-chat', chat);
  })
});

server.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});
