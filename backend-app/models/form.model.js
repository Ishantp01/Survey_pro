import mongoose from "mongoose";

const formLinkSchema = new mongoose.Schema({
  linkId: { type: String, required: true, unique: true },
  isUsed: { type: Boolean, default: false },
  usedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("FormLink", formLinkSchema);
