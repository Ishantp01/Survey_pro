import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not eligible" });
    }

    // Case 1: First login → no password set
    if (user.firstLogin && !user.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.firstLogin = false;
      await user.save();

      return res.json({
        success: true,
        message: "Password set successfully. Logged in.",
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }),
      });
    }

    // Case 2: Normal login
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(420).json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
