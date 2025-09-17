import express from "express";
import { generateFormLink, submitFormResponse, getResponses, sendFormInvites, getResponsesByDate, getAllResponses } from "../controllers/formController.js";
import { protect } from "../middlewares/AuthMiddleware.js   "

const router = express.Router();

router.post("/generate", generateFormLink); // admin generates link
router.post("/submit", protect, submitFormResponse); // user submits
router.get("/:formId/responses", getResponses); // get responses by formId
router.get("/responses-all", getAllResponses); // get responses by formId
router.post("/send-invites", sendFormInvites);
router.get("/responses/by-date", getResponsesByDate) // get responses by date


export default router;
