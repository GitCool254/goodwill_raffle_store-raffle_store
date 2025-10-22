import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Load service account key file
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH || "./creds/service_account.json";

let auth;
try {
  const creds = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH));
  auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
} catch (err) {
  console.error("Failed to load service account key:", err.message);
}

const SHEET_ID = process.env.SHEET_ID; // Google Sheet ID

// POST /api/log-entry
app.post("/api/log-entry", async (req, res) => {
  try {
    const { name, email, ticketNo, product, amount } = req.body;
    if (!name || !email || !ticketNo || !product)
      return res.status(400).json({ error: "Missing required fields" });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    const now = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Entries!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[now, name, email, product, ticketNo, amount || ""]],
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log entry" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Goodwill Raffle logging server running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

