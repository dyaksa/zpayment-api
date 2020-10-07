const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");
const userRoute = require("./routes/user");
const transferRoute = require("./routes/transfer");
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
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

app.listen(3000, () => {
  console.log("server running on port 3000");
});
