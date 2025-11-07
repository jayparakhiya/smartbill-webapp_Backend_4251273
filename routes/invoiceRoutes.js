const express = require("express");
const { saveInvoiceAndSendMail } = require("../controller/invoiceController");
const auth = require("../middleware/authMiddleware");
const upload = require("../utils/invoiceUpload");
const router = express.Router();

router.post(
  "/save-invoice-with-email",
  auth,
  upload.single("pdf"), 
  saveInvoiceAndSendMail 
);

module.exports = router;
