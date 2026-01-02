import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import { connectDB } from "./config/db.js";


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// MIDDLEWARES (must come before routes)
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://august-mary-booking-website.vercel.app"
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));


// ROUTES
import bookingRoutes from "./routes/bookingRoutes.js";
app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminBookingRoutes);

import contactRoutes from "./routes/contactRoutes.js";

app.use("/api/contact", contactRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port " + process.env.PORT);
});
