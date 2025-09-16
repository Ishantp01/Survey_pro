import crypto from "crypto";
import FormLink from "../models/form.model.js";
import FormResponse from "../models/formResponse.model.js";

/**
 * @desc Generate a unique form link
 * @route POST /api/form/generate
 */
export const generateFormLink = async (req, res) => {
  try {
    // 🔁 Reset all users
    await User.updateMany({}, {
      $set: {
        password: null,
        firstLogin: true,
        formSubmitted: false
      }
    });

    // 🔑 Generate new link
    const linkId = crypto.randomBytes(16).toString("hex");
    const newLink = await FormLink.create({ linkId });

    res.status(201).json({
      success: true,
      message: "Form link generated successfully. All users have been reset.",
      link: `https://yourfrontend.com/form/${linkId}`,
      linkId: newLink.linkId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get form structure if link is valid & not used
 * @route GET /api/form/:linkId
 */
export const getFormStructure = async (req, res) => {
  try {
    const { linkId } = req.params;

    const link = await FormLink.findOne({ linkId });

    if (!link) {
      return res.status(404).json({ success: false, message: "Invalid form link" });
    }

    if (link.isUsed) {
      return res.status(400).json({ success: false, message: "Form already submitted" });
    }

    // Send structure (or frontend can hardcode structure too)
    res.json({
      success: true,
      structure: {
        fields: ["headquarters", "division", "group", "position"]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Submit the form response
 * @route POST /api/form/:linkId/submit
 */
export const submitForm = async (req, res) => {
  try {
    const { linkId } = req.params;
    const { headquarters, division, group, position } = req.body;

    const link = await FormLink.findOne({ linkId });

    if (!link) {
      return res.status(404).json({ success: false, message: "Invalid form link" });
    }

    if (link.isUsed) {
      return res.status(400).json({ success: false, message: "Form already submitted" });
    }

    // Save response
    const response = await FormResponse.create({
      linkId,
      headquarters,
      division,
      group,
      position
    });

    // Mark link as used
    link.isUsed = true;
    link.usedAt = new Date();
    await link.save();

    res.status(201).json({ success: true, message: "Form submitted successfully", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get all submitted form responses
 * @route GET /api/form/responses/all
 */
export const getAllResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find().sort({ submittedAt: -1 });
    res.json({ success: true, responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Delete a form response and its associated link
 * @route DELETE /api/form/responses/:id
 */
export const deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await FormResponse.findById(id);
    if (!response) {
      return res.status(404).json({ success: false, message: "Response not found" });
    }

    // Delete response
    await FormResponse.findByIdAndDelete(id);

    // Delete associated link
    await FormLink.findOneAndDelete({ linkId: response.linkId });

    res.json({ success: true, message: "Response and link deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
