require("dotenv").config();

module.exports = {
  secret: process.env.SECRET_KEY,
  //1 is admin 2 is user but login
  roles: [1, 2],
};
