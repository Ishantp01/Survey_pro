import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  headquarters: { type: String, required: true },
  division: { type: String, required: true },
  group: { type: String, required: true },
  position: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FormResponse", formResponseSchema);
