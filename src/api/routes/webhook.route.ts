import { Router } from "express";
import { handleWebhook } from "../controllers/webhook.controller";

const router = Router();

// GitHub PR Webhook
router.post("/", handleWebhook);

export default router;
