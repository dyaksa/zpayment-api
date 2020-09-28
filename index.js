const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");
const userRoute = require("./routes/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

//topup route
app.use("/topup", toupupRoute);
//user route
app.use("/user", userRoute);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
