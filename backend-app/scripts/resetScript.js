// backend-app/resetUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const resetUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.updateMany({}, {
      $set: {
        password: null,
        firstLogin: true,
        formSubmitted: false
      }
    });

    console.log("✅ All users have been reset successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error resetting users:", err);
    process.exit(1);
  }
};

resetUsers();