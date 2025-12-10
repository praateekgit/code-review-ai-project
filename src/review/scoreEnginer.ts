export const generateReviewScore = (issues: number, warnings: number): number => {
    let score = 100;
    score -= issues * 5;
    score -= warnings * 2;
    return Math.max(score, 10);
};
