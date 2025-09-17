import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  linkId: { type: String, required: true },
  headquarters: String,
  division: String,
  group: String,
  position: String,
  email: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  }, // Explicit _id
  __v: Number,
});

export default mongoose.model("FormResponse", formResponseSchema);
