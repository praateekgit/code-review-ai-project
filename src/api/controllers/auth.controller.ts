import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

export const loginWithGithub = (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;

  const redirectUrl =
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;

  res.redirect(redirectUrl);
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) return res.status(400).send("Missing 'code'");

    // 1️⃣ Exchange code → access_token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).send("GitHub auth failed");

    // 2️⃣ Create JWT to store user session
    const jwtToken = jwt.sign(
      { githubToken: accessToken },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 3️⃣ Redirect user back to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth-success?token=${jwtToken}`
    );

  } catch (error: any) {
    console.error("GitHub OAuth error:", error);
    return res.status(500).send("GitHub OAuth failed");
  }
};
