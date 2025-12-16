// src/api/controllers/auth.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

export const loginWithGithub = (req: Request, res: Response) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || process.env.GITHUB_REDIRECT_URL;

    if (!clientId) {
      console.error("[OAuth] missing GITHUB_CLIENT_ID");
      return res.status(500).send("Server misconfigured: missing GITHUB_CLIENT_ID");
    }
    if (!redirectUri) {
      console.error("[OAuth] missing GITHUB_REDIRECT_URI");
      return res.status(500).send("Server misconfigured: missing GITHUB_REDIRECT_URI");
    }

    const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;

    console.log("[OAuth] redirecting to GitHub:", url);
    return res.redirect(url);
  } catch (err) {
    console.error("[OAuth] loginWithGithub error:", err);
    return res.status(500).send("OAuth redirect failed");
  }
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      console.error("[OAuth] callback missing code:", req.query);
      return res.status(400).send("Missing code");
    }

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const ghToken = tokenRes.data?.access_token;
    if (!ghToken) {
      console.error("[OAuth] no access_token in response:", tokenRes.data);
      return res.status(400).send("GitHub auth failed");
    }

    if (!process.env.JWT_SECRET) {
      console.error("[OAuth] missing JWT_SECRET");
      return res.status(500).send("Server misconfigured: missing JWT_SECRET");
    }

    const session = jwt.sign({ ghToken }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const frontend = process.env.FRONTEND_URL || process.env.FRONTEND || process.env.NEXT_PUBLIC_API_BASE;
    if (!frontend) {
      console.error("[OAuth] missing FRONTEND_URL");
      return res.status(500).send("Server misconfigured: missing FRONTEND_URL");
    }

    console.log("[OAuth] issuing session, redirecting back to frontend");
    return res.redirect(`${frontend}/auth/callback?token=${encodeURIComponent(session)}`);
  } catch (error: any) {
    console.error("GitHub OAuth error:", error?.response?.data ?? error?.message ?? error);
    return res.status(500).send("GitHub OAuth failed");
  }
};
