import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

export const loginWithGithub = (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const redirectUri = process.env.GITHUB_REDIRECT_URI!;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=repo,user`;

  console.log("Redirecting to:", url); // DEBUG

  return res.redirect(url);
};



export const githubCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) return res.status(400).send("Missing code");

    // Exchange code → access_token
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

    // sign session JWT
    const session = jwt.sign(
      { ghToken },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Redirect back to frontend
return res.redirect(
  `${process.env.FRONTEND_URL}/auth/callback?token=${session}`
);


  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).send("OAuth failed");
  }
};

export const getUser = async (req: any, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const ghToken = decoded.ghToken;

    const user = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${ghToken}` }
    });

    return res.json({ ok: true, user: user.data });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
