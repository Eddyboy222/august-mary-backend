import { ContactMessage } from "../models/contactMessage.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Save to DB
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    // ✅ RESPOND IMMEDIATELY (NO TIMEOUT)
    res.status(201).json({
      message: "Message received successfully",
      data: newMessage,
    });

    // ⬇️ EMAIL SENT IN BACKGROUND
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    .catch(err => {
      console.error("Email failed:", err.message);
    });

  } catch (error) {
    console.error("Contact error:", error.message);
    // ❌ Do NOT send another response here
  }
};
