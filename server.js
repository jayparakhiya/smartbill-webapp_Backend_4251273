const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
require("./utils/passport");

const app = express();

// Connect to the database
connectDB();

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Init Middleware
app.use(express.json());
app.use(passport.initialize());

// Define routes
app.get("/", (req, res) => {
  res.json({ message: "Hello... Backend" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/hsn", require("./routes/hsnRoutes"));
app.use("/api/billing-entities", require("./routes/billingEntityRoutes"));
app.use("/api", require("./routes/verifyGSTRoutes"));
app.use("/api", require("./routes/invoiceRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
