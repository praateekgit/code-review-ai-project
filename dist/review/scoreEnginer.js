"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReviewScore = void 0;
const generateReviewScore = (issues, warnings) => {
    let score = 100;
    score -= issues * 5;
    score -= warnings * 2;
    return Math.max(score, 10);
};
exports.generateReviewScore = generateReviewScore;
