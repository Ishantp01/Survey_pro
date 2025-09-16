import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String }, // empty until first login
  firstLogin: { type: Boolean, default: true }, // true until password set
  formSubmitted: { type: Boolean, default: false }, // reset each new form
});

export default mongoose.model("User", userSchema);
