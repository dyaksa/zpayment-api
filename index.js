const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const toupupRoute = require("./routes/topup");

app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

//topup route
app.use("/topup", toupupRoute);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
