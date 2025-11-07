const Invoice = require("../models/Invoice");
const { sendEmail } = require("../utils/emailService");

const saveInvoiceAndSendMail = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    // Parse invoiceData
    const invoiceData = JSON.parse(req.body.invoiceData);

    // Save invoice details in the database
    const newInvoice = new Invoice(invoiceData);
    const savedInvoice = await newInvoice.save();

    // Send the email to the client
    const clientEmail = invoiceData.client.email;
    if (!clientEmail) {
      return res.status(400).json({ message: "Client email is required" });
    }

    const subject = `Invoice from ${invoiceData.biller.name}`;
    const htmlContent = `
      <p>Hello ${invoiceData.client.name},</p>
      <p>Please find attached the invoice for your recent transaction.</p>
      <p>Thank you for your business.</p>
      <p>Best regards,</p>
      <p>${invoiceData.biller.name}</p>
    `;

    const attachmentPath = req.file.path; // Uploaded PDF file path
    await sendEmail(clientEmail, subject, htmlContent, attachmentPath);

    // Response after successfully saving the invoice and sending the email
    res.status(200).json({
      message: "Invoice saved and email sent successfully",
      invoice: savedInvoice,
    });
  } catch (error) {
    console.error("Error saving invoice or sending email:", error);
    res.status(500).json({
      message: "Failed to save invoice or send email",
      error: error.message,
    });
  }
};

module.exports = {
  saveInvoiceAndSendMail,
};
