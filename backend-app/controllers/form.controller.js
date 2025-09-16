import Form from "../models/form.model.js";
import FormResponse from "../models/formResponse.model.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

// Admin creates a new form
export const createForm = async (req, res) => {
  try {
    const newForm = await Form.create({ formId: uuidv4() });

    // Reset all users' formSubmitted to false
    await User.updateMany({}, { $set: { formSubmitted: false } });

    res.status(201).json({ success: true, form: newForm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// User submits response
export const submitFormResponse = async (req, res) => {
  try {
    const { formId, headquarters, division, group, position } = req.body;
    const userId = req.user._id; // from auth middleware

    const form = await Form.findOne({ formId, isActive: true });
    if (!form) return res.status(404).json({ message: "Form not found" });

    const alreadySubmitted = await FormResponse.findOne({ formId: form._id, userId });
    if (alreadySubmitted) {
      return res.status(400).json({ message: "You already submitted this form" });
    }

    const response = await FormResponse.create({
      formId: form._id,
      userId,
      headquarters,
      division,
      group,
      position,
    });

    await User.findByIdAndUpdate(userId, { formSubmitted: true });

    res.status(201).json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
