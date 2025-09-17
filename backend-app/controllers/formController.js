import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";
import crypto from "crypto";

// Generate new form link
export const generateFormLink = async (req, res) => {
  try {
    // deactivate all old forms
    await Form.updateMany({}, { $set: { active: false } });

    const token = crypto.randomBytes(16).toString("hex");
    const link = `${process.env.FRONTEND_URL}/form/${token}`;

    const newForm = new Form({ link, active: true });
    await newForm.save();

    res.json({ success: true, form: newForm });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error generating form link", error: err.message });
  }
}

// Submit form response
export const submitFormResponse = async (req, res) => {
  try {
    const { department, team, group, position, timeSlots } = req.body;
    const email = req.user.email; // from token

    const activeForm = await Form.findOne({ active: true });
    if (!activeForm) return res.status(400).json({ success: false, message: "No active form" });

    // Prevent duplicate submissions
    const existingResponse = await FormResponse.findOne({ formId: activeForm._id, email });
    if (existingResponse) {
      return res.status(400).json({ success: false, message: "You have already submitted this form." });
    }

    const response = new FormResponse({
      formId: activeForm._id,
      email,
      department,
      team,
      group,
      position,
      timeSlots, // array of {timeRange, task1, task2}
    });

    await response.save();

    res.json({ success: true, message: "Response saved successfully", response });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error submitting response", error: err.message });
  }
};

// Get all responses for a form
export const getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const { startDate, endDate } = req.query;

    let filter = { formId };
    if (startDate && endDate) {
      filter.submittedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const responses = await FormResponse.find(filter);
    res.json({ success: true, responses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching responses", error: err.message });
  }
};