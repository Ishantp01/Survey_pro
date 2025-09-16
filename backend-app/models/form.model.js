import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  formId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Form", formSchema);
