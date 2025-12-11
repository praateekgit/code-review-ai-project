"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubCallback = exports.loginWithGithub = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginWithGithub = (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
    res.redirect(redirectUrl);
};
exports.loginWithGithub = loginWithGithub;
const githubCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(400).send("Missing 'code'");
        // 1️⃣ Exchange code → access_token
        const tokenRes = await axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, { headers: { Accept: "application/json" } });
        const accessToken = tokenRes.data.access_token;
        if (!accessToken)
            return res.status(400).send("GitHub auth failed");
        // 2️⃣ Create JWT to store user session
        const jwtToken = jsonwebtoken_1.default.sign({ githubToken: accessToken }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // 3️⃣ Redirect user back to frontend with token
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${jwtToken}`);
    }
    catch (error) {
        console.error("GitHub OAuth error:", error);
        return res.status(500).send("GitHub OAuth failed");
    }
};
exports.githubCallback = githubCallback;
