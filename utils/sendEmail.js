import nodemailer from "nodemailer";

export const sendBookingEmail = async (booking) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"New Booking" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // admin email (you)
    subject: "📅 New Booking Received",
    html: `
      <h2>New Booking Details</h2>
      <p><strong>Name:</strong> ${booking.fullName}</p>
      <p><strong>Date:</strong> ${booking.selectedDay}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <p><strong>MainOption:</strong> ${booking.mainOption}</p>
      <p><strong>SubOption:</strong> ${booking.subOption}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Description:</strong> ${booking.description || "N/A"}</p>
    `,
  };

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "exists" : "missing");

  await transporter.sendMail(mailOptions);
};
