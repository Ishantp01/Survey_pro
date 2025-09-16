import express from "express";
import {
  submitTimeSlots,
  getAllTimeSlotSubmissions,
  getMySubmission,
  deleteTimeSlotSubmission
} from "../controllers/timeslotController.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/submit",protect, submitTimeSlots);
router.get("/me", protect, getMySubmission);
router.get("/all", getAllTimeSlotSubmissions); // Admin can protect this separately
router.delete("/:id", deleteTimeSlotSubmission);

export default router;
