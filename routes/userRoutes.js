const express = require("express");
const { getUserById, getAllUsers } = require("../controller/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getAllUsers);
router.get("/:id", auth, getUserById);

module.exports = router;
