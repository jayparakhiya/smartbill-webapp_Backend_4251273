const express = require("express");
const { verifyGstController } = require("../controller/verifyGSTController");
const router = express.Router();

router.get('/verify-gst/:gstNumber', verifyGstController);


module.exports = router;
