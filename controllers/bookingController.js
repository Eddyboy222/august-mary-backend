import { Booking } from "../models/booking.js";
import nodemailer from "nodemailer";

/* ================= EMAIL TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
});

/* ================= CREATE BOOKING ================= */
export const createBooking = async (req, res) => {
  try {
    // 1️⃣ Save booking to DB
    const booking = await Booking.create(req.body);

    // 2️⃣ Send email (DO NOT BLOCK RESPONSE)
    transporter
      .sendMail({
        from: `"New Booking" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Booking Appointment",
        html: `
          <h3>New Booking</h3>
          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Date:</strong> ${booking.selectedDay}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Service:</strong> ${booking.mainOption}</p>
          ${
            booking.subOption
              ? `<p><strong>Type:</strong> ${booking.subOption}</p>`
              : ""
          }
          ${
            booking.description
              ? `<p><strong>Description:</strong> ${booking.description}</p>`
              : ""
          }
        `,
      })
      .catch((err) => {
        console.error("📧 Booking email failed:", err.message);
      });

    // 3️⃣ Always return success if booking saved
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};

/* ================= GET BOOKINGS ================= */
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

/* ================= DELETE BOOKING ================= */
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
