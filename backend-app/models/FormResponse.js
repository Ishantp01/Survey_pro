import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  timeRange: { type: String, required: true }, // e.g., "07:30-08:00"
  task1: { type: String, required: true },     // dropdown value from frontend
  task2: { type: String, required: true },     // dropdown value from frontend
});

const formResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  email: { type: String, required: true }, // user email from token
  department: { type: String, required: true }, 
  team: { type: String, required: true },
  group: { type: String, required: true },
  position: { type: String, required: true },
  timeSlots: [timeSlotSchema], // multiple slots per response
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("FormResponse", formResponseSchema);