import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const emails = [
  "john.doe@example.com",
  "jane.smith@example.com",
  "alice.williams@example.com",
  "bob.johnson@example.com",
  "emma.brown@example.com",
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const seedData = emails.map((email) => ({
      email,
      password: null,
      firstLogin: true,
      hasSubmitted: false,
    }));

    await User.insertMany(seedData);

    console.log("✅ Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
