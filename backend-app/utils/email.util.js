import nodemailer from "nodemailer";

// Configure transporter for Outlook / Office365
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",   
  port: 587,                    
  secure: false,                
  auth: {
    user: "lcy@learning-crew.com", 
    pass: "zlsywqyqwygfrzcm"  
  },
});

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: "lcy@learning-crew.com",
    to,
    subject,
    text,
    html
  };

  await transporter.sendMail(mailOptions);
};
