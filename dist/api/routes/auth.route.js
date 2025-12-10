"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get("/github/login", auth_controller_1.loginWithGithub);
router.get("/github/callback", auth_controller_1.githubCallback);
exports.default = router;
