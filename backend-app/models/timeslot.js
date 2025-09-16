import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  timeRange: { type: String, required: true },
  activity1: { type: String, required: true },
  activity2: { type: String, required: true }
});

const TimeSlotSubmissionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  slots: [TimeSlotSchema],
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("TimeSlotSubmission", TimeSlotSubmissionSchema);