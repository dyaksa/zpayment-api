const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");
const userRoute = require("./routes/user");
const transferRoute = require("./routes/transfer");
const authRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
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

app.listen(PORT, function () {
  console.log(`server running on port ${PORT}`);
});
