import { Router } from "express";
import { actualReview, prReview, getHistory } from "../controllers/review.controller";

const router = Router();

router.post("/", actualReview);    // POST /review
router.post("/pr", prReview);      // POST /review/pr
router.get("/history", getHistory);

export default router;
