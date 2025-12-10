"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const webhook_route_1 = __importDefault(require("./routes/webhook.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const config_1 = require("../utils/config");
const db_1 = require("./db"); // <-- ADD THIS
(0, config_1.loadConfig)();
(0, db_1.connectDB)(); // <-- ADD THIS
console.log("DEBUG ENV:", process.env.GROQ_API_KEY);
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use("/webhook", webhook_route_1.default);
app.use("/review", review_route_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`⚡ Server running on port ${PORT}`);
});
