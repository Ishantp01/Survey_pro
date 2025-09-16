import nodemailer from "nodemailer";

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "Outlook",
  auth: {
    user: process.env.OUTLOOK_USER, // your outlook email
    pass: process.env.OUTLOOK_PASS  // your outlook app password
  }
});

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.OUTLOOK_USER,
    to,
    subject,
    text,
    html
  };

  await transporter.sendMail(mailOptions);
};
