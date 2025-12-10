"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postPRComment = void 0;
const githubClient_1 = require("./githubClient");
const postPRComment = async (repo, prNumber, body) => {
    const [owner, name] = repo.split("/");
    return githubClient_1.githubClient.post(`/repos/${owner}/${name}/issues/${prNumber}/comments`, {
        body,
    });
};
exports.postPRComment = postPRComment;
