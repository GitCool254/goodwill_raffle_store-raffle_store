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
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let credentials;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // Load from environment variable on Render
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  console.log("✅ Loaded Google credentials from environment variable");
} else {
  // Fallback to local file for Termux/local dev
  const keyPath = path.join(__dirname, "creds", "goodwill_raffle_store.json");
  const keyFile = fs.readFileSync(keyPath, "utf8");
  credentials = JSON.parse(keyFile);
  console.log("✅ Loaded Google credentials from local file");
}
// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: "./server/creds/goodwill_raffle_store.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.SHEET_ID;

console.log("🧠 Connected to Google Sheets API. Sheet ID:", SHEET_ID);
// ✅ API endpoint to log raffle entries
app.post("/api/raffle-entry", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:E", // <-- update if tab name is different
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, email, product, quantity]],
      },
    });

    console.log(`✅ Entry added to Google Sheets: ${name} (${email})`);
    console.log("Spreadsheet response:", response.data);

  } catch (err) {
    console.error("❌ Failed to add entry to Google Sheets:");
    console.error(err);
  }
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

