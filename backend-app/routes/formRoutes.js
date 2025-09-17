import express from "express";
import { generateFormLink, submitFormResponse, getResponses } from "../controllers/formController.js";
import { protect } from "../middlewares/AuthMiddleware.js   "

const router = express.Router();

router.post("/generate", generateFormLink); // admin generates link
router.post("/submit", protect, submitFormResponse); // user submits
router.get("/:formId/responses", getResponses); // get responses by formId

export default router;
