const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");
const { sendEmail } = require("../utils/emailService");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleVerify = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub } = payload; // 'sub' is Google's user ID

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      // Create a new user if it doesn't exist
      user = new User({
        googleId: sub,
        email: email,
      });
      await user.save();
    }
    console.log("user ===== ", user);

    const accessToken = generateToken(user._id, process.env.JWT_SECRET, "1h");
    const refreshToken = generateToken(
      user._id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ message: "Google Token validation failed" });
  }
};

const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = jwt.sign(
      { id: user._id, resetToken },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    const emailContent = `<p>To reset your password, click <a href="${resetLink}">here</a></p>`;

    // Send the email using emailService
    await sendEmail(user.email, "Password Reset", emailContent);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const accessToken = generateToken(user._id, process.env.JWT_SECRET, "15m");
    const refreshToken = generateToken(
      user._id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(user._id, process.env.JWT_SECRET, "15m");
    const refreshToken = generateToken(
      user._id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    console.log("err ===== ", err);
    res.status(500).send("Server error");
  }
};

const validateToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log("refreshToken ===== ", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("insidedecoded ===== ", decoded);
    const accessToken = generateToken(
      decoded.id,
      process.env.JWT_SECRET,
      "15m"
    );
    const newRefreshToken = generateToken(
      decoded.id,
      process.env.JWT_REFRESH_SECRET,
      "7d"
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  googleVerify,
  registerUser,
  authUser,
  validateToken,
  getMe,
  forgotPassword,
  resetPassword,
};
