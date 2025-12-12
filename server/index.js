// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { google } from "googleapis";

dotenv.config();

// ✅ Initialize app first
const app = express();

// ✅ Then apply middleware
app.use(cors({
  origin: "*",             // allow all origins
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// 🧾 Load service account credentials
const creds = JSON.parse(fs.readFileSync("/data/data/com.termux/files/home/goodwill_raffle_store/raffle_store/server/creds/goodwill_raffle_store.json"));
// 🔑 Setup Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// 📊 Initialize Sheets API
const sheets = google.sheets({ version: "v4", auth });

// 📋 Your Spreadsheet info
const SHEET_ID = process.env.SHEET_ID; // from .env
const SHEET_NAME = "Sheet1"; // 👈 make sure this matches your Google Sheet tab name exactly!

// 🧠 API endpoint — append a raffle entry
app.post("/api/log-entry", async (req, res) => {
  try {
    const { fullName, email, product, ticketNumber } = req.body;
    const timestamp = new Date().toISOString();

    console.log("📥 Received entry:", req.body);

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, fullName, email, product, ticketNumber]],
      },
    });

    console.log("✅ Appended row successfully:", result.statusText);
    res.json({ success: true, status: result.statusText });
  } catch (err) {
    console.error("❌ Error appending to sheet:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🧪 Test endpoint
app.get("/", (req, res) => res.send("✅ Raffle API running"));

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
