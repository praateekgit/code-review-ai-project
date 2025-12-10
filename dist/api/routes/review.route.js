"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const router = (0, express_1.Router)();
router.post("/", review_controller_1.actualReview); // POST /review
router.post("/pr", review_controller_1.prReview); // POST /review/pr
router.get("/history", review_controller_1.getHistory);
exports.default = router;
