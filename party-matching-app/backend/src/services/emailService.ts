import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter
// For Gmail, you would use:
// service: 'gmail',
// auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g., 'your-email@gmail.com'
    pass: process.env.EMAIL_PASS, // App Password from Google Account
  },
});

export const sendTicketEmail = async (
  to: string,
  name: string,
  partyName: string,
  ticketCode: string,
  date: string,
  location: string
) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not found. Skipping email send.');
      console.log(`Mock Email to ${to}: Ticket ${ticketCode} for ${partyName}`);
      return;
    }

    const mailOptions = {
      from: `"Party Match App" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Ticket for ${partyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #4A90E2; text-align: center;">${partyName}</h1>
          <p>Hi ${name},</p>
          <p>Here is your ticket for the upcoming party!</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 5px 0; font-weight: bold;">Ticket Code:</p>
            <h2 style="margin: 10px 0; letter-spacing: 2px; color: #333;">${ticketCode}</h2>
            <p style="font-size: 12px; color: #666;">Show this code at the entrance</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>

          <p>See you there!</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
