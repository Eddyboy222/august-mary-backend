import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmail = async (booking) => {
  return await resend.emails.send({
    from: "August Mary <onboarding@resend.dev>", // works without domain setup
    to: [process.env.EMAIL_USER], // your Gmail
    subject: "📅 New Booking Appointment",
    html: `
      <h2>New Booking Received</h2>
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
  });
};
