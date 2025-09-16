import TimeSlotSubmission from "../models/timeslot.js";
import User from "../models/user.js";

// Submit timeslot form
export const submitTimeSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ error: "Slots are required" });
    }

    // Save all slots in one submission
    const submission = new TimeSlotSubmission({
      userEmail: email,
      slots
    });

    await submission.save();

    // Mark user as submitted
    await User.findOneAndUpdate(
      { email },
      { formSubmitted: true },
      { new: true }
    );

    res.json({
      message: "All time slots submitted successfully",
      submission
    });
  } catch (error) {
    console.error("Error saving timeslot:", error);
    res.status(500).json({ error: "Failed to save time slots" });
  }
};

// Get all submissions
export const getAllTimeSlotSubmissions = async (req, res) => {
  try {
    const submissions = await TimeSlotSubmission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
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
