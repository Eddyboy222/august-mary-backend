import { Booking } from "../models/booking.js";
import { sendBookingEmail } from "../utils/sendEmail.js";

export const createBooking = async (req, res) => {
  try {
    const { selectedDay } = req.body;

    // ✅ ENFORCE MAX 2 BOOKINGS PER DAY
    const existingCount = await Booking.countDocuments({ selectedDay });

    if (existingCount >= 3) {
      return res.status(400).json({
        message: "This date is fully booked",
      });
    }

    // ✅ CREATE BOOKING
    const booking = await Booking.create(req.body);

    // 🔔 SEND EMAIL (NON-BLOCKING)
    sendBookingEmail(booking).catch((err) => {
      console.error("📧 Booking email failed:", err.message);
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting booking",
      error: error.message,
    });
  }
};
