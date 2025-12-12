import fs from "fs";
import { google } from "googleapis";

(async () => {
  try {
    const credsPath = "./creds/goodwill_raffle_store.json";
    if (!fs.existsSync(credsPath)) throw new Error("Credentials file not found: " + credsPath);

    const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
    console.log("Using client_email:", creds.client_email);

    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SHEET_ID = process.env.SHEET_ID || "1MFzW--DbH3AOyBo5yHvCG86dm02RDUP5mwg4rd2fAlM";
    // Try to get spreadsheet metadata
    const res = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    console.log("Spreadsheet title:", res.data.properties.title);
    console.log("Sheets found:");
    res.data.sheets.forEach(s => console.log(" -", s.properties.title));
  } catch (err) {
    console.error("TEST ERROR:", err && err.message ? err.message : err);
    if (err.errors) console.error(err.errors);
  }
})();
