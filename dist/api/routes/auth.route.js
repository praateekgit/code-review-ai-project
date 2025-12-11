"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get("/auth/github", auth_controller_1.loginWithGithub);
router.get("/auth/github/callback", auth_controller_1.githubCallback);
router.get("/auth/me", auth_controller_1.getUser);
exports.default = router;
