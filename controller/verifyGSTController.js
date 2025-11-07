const express = require('express');
const axios = require('axios');

const verifyGstController = async (req, res) => {
  const { gstNumber } = req.params;

  try {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    if (!gstRegex.test(gstNumber)) {
      return res.status(400).json({ error: 'Invalid GST number format' });
    }

    const response = await axios.get(`https://razorpay.com/api/gstin/${gstNumber}`);

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data || 'Error fetching GST details',
      });
    } else {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};


module.exports = { verifyGstController };