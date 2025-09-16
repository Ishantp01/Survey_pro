import TimeSlotSubmission from "../models/timeslot.js";
import User from "../models/user.model.js";

// Submit timeslot form
export const submitTimeSlots = async (req, res) => {
  try {
    const userEmail = req.user.email; // from token
    const { slots } = req.body;

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ success: false, message: "Slots are required" });
    }

    for (const slot of slots) {
      if (!slot.timeRange || !slot.activity1 || !slot.activity2) {
        return res.status(400).json({
          success: false,
          message: "Each slot must have timeRange, activity1, and activity2"
        });
      }
    }

    const submission = await TimeSlotSubmission.create({
      userEmail,
      slots
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all submissions
export const getAllTimeSlots = async (req, res) => {
  try {
    const submissions = await TimeSlotSubmission.find().sort({ submittedAt: -1 });
    res.json({ success: true, submissions });
  } catch (error) {
    console.error("Get timeslots error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get submission of logged-in user
export const getMySubmission = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const submission = await TimeSlotSubmission.findOne({ userEmail: email });
    if (!submission) return res.status(404).json({ error: "No submission found" });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};

// Delete submission by ID (admin use)
export const deleteTimeSlotSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TimeSlotSubmission.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Submission not found" });
    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete submission" });
  }
};
