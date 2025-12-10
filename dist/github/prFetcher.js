"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChangedFiles = exports.fetchPRDiff = void 0;
const githubClient_1 = require("./githubClient");
const fetchPRDiff = async (repo, prNumber) => {
    const [owner, name] = repo.split("/");
    const diff = await githubClient_1.githubClient.get(`/repos/${owner}/${name}/pulls/${prNumber}`, { headers: { Accept: "application/vnd.github.diff" } });
    return diff.data;
};
exports.fetchPRDiff = fetchPRDiff;
const fetchChangedFiles = async (repo, prNumber) => {
    const [owner, name] = repo.split("/");
    const res = await githubClient_1.githubClient.get(`/repos/${owner}/${name}/pulls/${prNumber}/files`);
    return res.data;
};
exports.fetchChangedFiles = fetchChangedFiles;
