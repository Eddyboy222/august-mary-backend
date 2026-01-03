import { sendBookingEmail } from "../utils/sendEmail.js";
import { Booking } from "../models/booking.js";

import nodemailer from "nodemailer";

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

await transporter.sendMail({
  from: `"New Booking" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "New Booking Appointment",
  html: `
    <h3>New Booking</h3>
    <p><strong>Name:</strong> ${booking.fullName}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Date:</strong> ${booking.date}</p>
    <p><strong>Service:</strong> ${booking.service}</p>
    <p><strong>Description:</strong> ${booking.description}</p>
  `,
});



export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // 🔹 Send email WITHOUT blocking booking
    try {
      await transporter.sendMail({
        from: `"New Booking" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: "New Booking",
        html: `<p>New booking from ${booking.fullName}</p>`,
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    // ✅ ALWAYS return success if booking saved
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

