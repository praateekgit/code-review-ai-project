import { Router } from "express";
import { actualReview, prReview, getHistory } from "../controllers/review.controller";

const router = Router();

// PR Review Endpoints
router.post("/", actualReview);
router.post("/pr", prReview);
router.get("/history", getHistory);

export default router;
