"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// PR Review Endpoints
router.post("/", review_controller_1.actualReview);
router.post("/pr", review_controller_1.prReview);
router.get("/history", review_controller_1.getHistory);
// GitHub OAuth Routes
router.get("/auth/github", auth_controller_1.loginWithGithub);
router.get("/auth/github/callback", auth_controller_1.githubCallback);
exports.default = router;
