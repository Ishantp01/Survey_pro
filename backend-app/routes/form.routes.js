// /routes/form.routes.js
import express from "express";
import {
  generateFormLink,
  getFormStructure,
  submitForm,
  getAllResponses,
  deleteResponse,
  sendFormInvites
} from "../controllers/form.controller.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/generate", generateFormLink);
router.get("/:linkId", getFormStructure);
router.post("/:linkId/submit",protect, submitForm);
router.get("/responses/all", getAllResponses);
router.delete("/responses/:id", deleteResponse);
router.post("/send-invites", sendFormInvites);

export default router;
