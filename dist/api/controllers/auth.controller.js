"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.githubCallback = exports.loginWithGithub = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginWithGithub = (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
    return res.redirect(url);
};
exports.loginWithGithub = loginWithGithub;
const githubCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(400).send("Missing code");
        // Exchange code → access_token
        const tokenRes = await axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, { headers: { Accept: "application/json" } });
        const ghToken = tokenRes.data.access_token;
        if (!ghToken)
            return res.status(400).send("GitHub auth failed");
        // sign session JWT
        const session = jsonwebtoken_1.default.sign({ ghToken }, process.env.JWT_SECRET, { expiresIn: "1d" });
        // Redirect back to frontend
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?session=${session}`);
    }
    catch (error) {
        console.error("OAuth error:", error);
        return res.status(500).send("OAuth failed");
    }
};
exports.githubCallback = githubCallback;
const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const ghToken = decoded.ghToken;
        const user = await axios_1.default.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${ghToken}` }
        });
        return res.json({ ok: true, user: user.data });
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.getUser = getUser;
