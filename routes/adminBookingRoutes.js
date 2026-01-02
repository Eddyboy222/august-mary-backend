// routes/adminBookingRoutes.js
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { getBookings, deleteBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.get("/bookings", adminAuth, getBookings);
router.delete("/bookings/:id", adminAuth, deleteBooking);

export default router;
