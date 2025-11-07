const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true }, // Sparse ensures it works with traditional logins as well
    username: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    }, // Only required for normal signup
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    }, // Required for normal signup
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
