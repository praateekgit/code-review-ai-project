import { Router } from "express";
import { actualReview, prReview, getHistory } from "../controllers/review.controller";
import { loginWithGithub, githubCallback } from "../controllers/auth.controller";

const router = Router();

// PR Review Endpoints
router.post("/", actualReview);
router.post("/pr", prReview);
router.get("/history", getHistory);

// GitHub OAuth Routes
router.get("/auth/github", loginWithGithub);
router.get("/auth/github/callback", githubCallback);

export default router;
