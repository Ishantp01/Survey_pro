import express from "express";
import {
  submitTimeSlots,
  getAllTimeSlots,
  getMySubmission,
  deleteTimeSlotSubmission
} from "../controllers/timeslotController.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/submit",protect, submitTimeSlots);
router.get("/me", protect, getMySubmission);
router.get("/all", getAllTimeSlots); // Admin can protect this separately
router.delete("/:id", deleteTimeSlotSubmission);

export default router;
