import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  linkId: { type: String, required: true },
  headquarters: String,
  division: String,
  group: String,
  position: String,
  email: { type: String, required: true }, // ✅ user email
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("FormResponse", formResponseSchema);
