const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
const authRoutes = require("./routes/auth");
const merchantRoutes = require("./routes/merchants");
const serviceRoutes = require("./routes/services");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");

// =========================
// API Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/merchants", merchantRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
    res.json({
        message: "ServiceHub API is running successfully"
    });
});

// =========================
// Server Configuration
// =========================
const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/servicehub";

// =========================
// MongoDB Connection
// =========================
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        // Start server only after MongoDB connects
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);
    });