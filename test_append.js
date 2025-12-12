import fs from "fs";
import { google } from "googleapis";

(async () => {
  try {
    const creds = JSON.parse(fs.readFileSync("./server/creds/goodwill_raffle_store.json", "utf8"));
    const auth = new google.auth.GoogleAuth({ credentials: creds, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SHEET_ID = process.env.SHEET_ID || "1MFzW--DbH3AOyBo5yHvCG86dm02RDUP5mwg4rd2fAlM";

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:E", // make sure your tab name matches
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toLocaleString(), "TEST User", "test@example.com", "iPhone 15 Pro", "1"]],
      },
    });

    console.log("Append result:", result.status, result.statusText || "");
  } catch (err) {
    console.error("APPEND ERROR:", err && err.message ? err.message : err);
    if (err.errors) console.error(err.errors);
  }
})();
