import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // will hold hashed temp password
  status: {
    type: String,
    enum: ["NOT_REGISTERED", "REGISTERED"],
    default: "NOT_REGISTERED"
  },
  formSubmitted: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);
export default User;
