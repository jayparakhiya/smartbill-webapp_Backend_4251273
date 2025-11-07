const fs = require("fs");
const path = require("path");

const HSN_FILE_PATH = path.join(__dirname, "../HSN_SAC.json");

// Controller to get HSN details
const getHSNDetails = (req, res) => {
  const { HSN_CD } = req.query;

  if (!HSN_CD || HSN_CD.length < 3) {
    return res.json({});
  }

  fs.readFile(HSN_FILE_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading HSN_SAC.json:", err);
      return res.status(500).json({ error: "Failed to read data" });
    }

    try {
      const hsnData = JSON.parse(data);
      const filteredData = hsnData.filter((item) =>
        item.HSN_CD.startsWith(HSN_CD)
      );
      if (filteredData.length === 0) {
        return res.json({});
      }

      res.json(filteredData);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      res.status(500).json({ error: "Invalid JSON data" });
    }
  });
};

module.exports = { getHSNDetails };
