import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstLogin: { type: Boolean, default: true },
  formSubmitted: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
