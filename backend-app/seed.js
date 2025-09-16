import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import connectDB from "./config/db.js";

dotenv.config();

const emails = [
  "user1@company.com",
  "user2@company.com",
  "user3@company.com"
  // ... add all your eligible emails here
];

const seedEmails = async () => {
  try {
    await connectDB();

    const emailDocs = emails.map(email => ({
      email,
      status: "NOT_REGISTERED",
      formSubmitted: false
    }));

    await User.insertMany(emailDocs, { ordered: false }); // skip duplicates
    console.log("✅ Eligible emails seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding emails:", err.message);
    process.exit(1);
  }
};

seedEmails();
