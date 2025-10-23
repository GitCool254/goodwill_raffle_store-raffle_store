import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Google credentials
// NEW: read from environment variable
const creds = JSON.parse(process.env.GOODWILL_JSON);
// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.SHEET_ID;

// ✅ API endpoint to log raffle entries
app.post("/api/raffle-entry", async (req, res) => {
  try {
    const { name, email, product, quantity } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    const timestamp = new Date().toLocaleString();

    // Append entry to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, email, product, quantity]],
      },
    });

    console.log(`New entry logged: ${name} (${email})`);
    res.json({ success: true, message: "Entry logged successfully!" });
  } catch (error) {
    console.error("Error saving entry:", error);
    res.status(500).json({ success: false, message: "Failed to save entry." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

