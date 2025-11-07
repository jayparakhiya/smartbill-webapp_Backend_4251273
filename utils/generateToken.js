const jwt = require("jsonwebtoken");

const generateToken = (userId, secret, expiresIn) => {
  console.log("userId ===== ", userId);
  const payload = {
    id: userId, // Consistent usage of 'id' for both normal and Google logins
  };

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
