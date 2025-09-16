import nodemailer from "nodemailer";

// Configure transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "himankjanjire4@gmail.com", // your Gmail address
    pass: "ziep qatb plrl pyfv"  // your Gmail App Password
  }
});

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    html
  };

  await transporter.sendMail(mailOptions);
};
