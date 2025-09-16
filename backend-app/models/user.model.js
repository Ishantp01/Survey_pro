import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long."],
    validate: {
      validator: function (v) {
        // Must contain at least one uppercase, one lowercase, one digit, and one special character
        return /^.{6,}$/.test(v);
      },
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    }
  },
  firstLogin: { type: Boolean, default: true },
  formSubmitted: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
