import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";
import crypto from "crypto";

// Generate new form link and reset users
export const generateFormLink = async (req, res) => {
  try {
    // Reset all users so they can re-submit
    await userModel.updateMany(
      {},
      {
        $set: {
          password: "qwe12345", // must be >= 8 chars (default password)
          firstLogin: true,
          formSubmitted: false,
        },
      }
    );

    // 2️⃣ Deactivate old form links
    await Form.updateMany({}, { $set: { active: false } });

    // 3️⃣ Generate new unique form link
    const linkId = crypto.randomBytes(16).toString("hex");
    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/form/${linkId}`;

    const newForm = new Form({ link, active: true });
    await newForm.save();

    // 4️⃣ Respond
    res.status(201).json({
      success: true,
      message: "Form link generated successfully. All users have been reset.",
      link,
      linkId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

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