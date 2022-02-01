const jwt = require("jsonwebtoken");

const generateTokenPassReset = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6m",
  });
};

module.exports = generateTokenPassReset;