// /routes/form.routes.js
import express from "express";
import {
  generateFormLink,
  getFormStructure,
  submitForm,
  getAllResponses,
  deleteResponse
} from "../controllers/form.controller.js";

const router = express.Router();

router.post("/generate", generateFormLink);
router.get("/:linkId", getFormStructure);
router.post("/:linkId/submit", submitForm);
router.get("/responses/all", getAllResponses);
router.delete("/responses/:id", deleteResponse);

export default router;
