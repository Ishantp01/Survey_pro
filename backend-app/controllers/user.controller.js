import bcrypt from "bcrypt";
import User from "../models/user.model.js";

// Register user with a temporary password
export const registerUser = async (req, res) => {
  try {
    const { email, tempPassword } = req.body;

    // Check if email exists in allowed list (DB seeded by admin)
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not eligible" });
    }

    // Prevent re-registration
    if (user.status === "REGISTERED") {
      return res.status(469).json({ message: "User already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    user.status = "REGISTERED";
    await user.save();

    res.json({ message: "Temporary password set successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login user with temp password
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.status !== "REGISTERED") {
      return res.status(400).json({ message: "User not registered yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
