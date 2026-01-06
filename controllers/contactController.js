import { ContactMessage } from "../models/contactMessage.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 🔹 Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 🔹 Save to DB
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    // ✅ RESPOND IMMEDIATELY (NO TIMEOUT ISSUES)
    res.status(201).json({
      message: "Message received successfully",
      data: newMessage,
    });

    // ⬇️ SEND EMAIL IN BACKGROUND (ADMIN ONLY — SANDBOX SAFE)
    resend.emails
      .send({
        from: "Contact Form <onboarding@resend.dev>",
        to: process.env.EMAIL_USER, // your email only
        subject: "New Contact Message",
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
      .catch((err) => {
        console.error("📧 Contact email failed:", err.message);
      });

  } catch (error) {
    console.error("Contact error:", error.message);
    // ❌ No second response
  }
};
