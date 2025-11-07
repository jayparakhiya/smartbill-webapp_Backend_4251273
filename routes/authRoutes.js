const express = require("express");
const { check } = require("express-validator");

const auth = require("../middleware/authMiddleware");
const {
  registerUser,
  validateToken,
  getMe,
  authUser,
  resetPassword,
  forgotPassword,
  googleVerify,
} = require("../controller/authController");
const passport = require("passport");

const router = express.Router();

router.post(
  "/signup",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authUser
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // On successful authentication
    res.redirect("/login/success");
  }
);

router.post("/google/verify", googleVerify);

router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  resetPassword
);
router.post("/token", validateToken);

router.get("/me", auth, getMe);

module.exports = router;
