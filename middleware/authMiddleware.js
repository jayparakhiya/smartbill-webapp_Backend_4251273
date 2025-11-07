const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token, handle expiration
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    console.log(" decoded===== ", decoded);
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired", tokenExpired: true });
    }
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
