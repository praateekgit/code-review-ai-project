import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import webhookRoute from "./routes/webhook.route";
import reviewRoute from "./routes/review.route";
import { loadConfig } from "../utils/config";
import { connectDB } from "./db";    // <-- ADD THIS
import authRoutes from "./routes/auth.route";

loadConfig();
connectDB();                         // <-- ADD THIS

console.log("DEBUG ENV:", process.env.GROQ_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/webhook", webhookRoute);
app.use("/review", reviewRoute);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

console.log("DEBUG JWT:", process.env.JWT_SECRET);
