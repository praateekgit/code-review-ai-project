import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

export const loginWithGithub = (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const redirectUri = process.env.GITHUB_REDIRECT_URI!;

  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=repo,user`;

  return res.redirect(url);
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Missing code");

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const ghToken = tokenRes.data.access_token;
    if (!ghToken) return res.status(400).send("GitHub auth failed");

    const session = jwt.sign(
      { ghToken },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?session=${session}`
    );
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    return res.status(500).send("Internal server error");
  }
};
