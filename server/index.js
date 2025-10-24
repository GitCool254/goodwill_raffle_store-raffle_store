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
  const { name, email, product, quantity } = req.body;
  console.log("Received POST request:", req.body);

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required" });
  }

  const timestamp = new Date().toISOString();
  const tabName = "Sheet1"; // change if you want a different tab

  try {
    // Ensure the tab exists
    const resTabs = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const tabs = resTabs.data.sheets.map(s => s.properties.title);
    if (!tabs.includes(tabName)) {
      console.log(`Tab "${tabName}" not found. Creating it.`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] }
      });
      console.log(`Tab "${tabName}" created.`);
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, email, product || "", quantity || ""]],
      },
    });

    console.log(`✅ Added entry to Google Sheets: ${name} (${email})`);
    console.log("Spreadsheet append response:", response.data);
    res.json({ success: true, message: "Entry logged successfully!" });

  } catch (err) {
    console.error("❌ Error writing to Google Sheets:", err);
    res.status(500).json({ success: false, message: "Failed to save entry" });
  }
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "../dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

