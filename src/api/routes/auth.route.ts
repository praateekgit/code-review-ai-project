import { Router } from "express";
import { loginWithGithub, githubCallback } from "../controllers/auth.controller";

const router = Router();

router.get("/github/login", loginWithGithub);

router.get("/github/callback", githubCallback);

export default router;
