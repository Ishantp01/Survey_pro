import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g. "07:00-07:30"
  task1: { type: String, required: true }, // free text
  task2: { type: String } // free text or empty
});

const timeSlotSubmissionSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    slots: [slotSchema], // array of time slots with tasks
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("TimeSlotSubmission", timeSlotSubmissionSchema);