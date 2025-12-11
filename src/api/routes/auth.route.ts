import { Router } from "express";
import { loginWithGithub, githubCallback, getUser } from "../controllers/auth.controller";

const router = Router();

router.get("/auth/github", loginWithGithub);
router.get("/auth/github/callback", githubCallback);
router.get("/auth/me", getUser);

export default router;
