import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  timeRange: { type: String, required: true },
  activity1: { type: String, required: true },
  activity2: { type: String, required: true },
  _id: false, // Prevent _id on subdocuments
});

const TimeSlotSubmissionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  slots: [TimeSlotSchema],
  submittedAt: { type: Date, default: Date.now },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  }, // Explicit _id
  __v: Number,
});

export default mongoose.model("TimeSlotSubmission", TimeSlotSubmissionSchema);
