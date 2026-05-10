import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const DATA_FILE = "/data/emails.json";

app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

if (!fs.existsSync("/data")) fs.mkdirSync("/data", { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

app.post("/api/submit", (req, res) => {
  const { email, name, job, years } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  try {
    const entries = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    entries.push({
      email,
      name: name || "",
      job: job || "",
      years: years || "",
      ts: new Date().toISOString(),
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/admin", (req, res) => {
  const auth = req.headers["authorization"];
  const expected =
    "Basic " +
    Buffer.from("admin:" + (process.env.ADMIN_PASSWORD || "changeme")).toString("base64");
  if (auth !== expected) {
    res.set("WWW-Authenticate", 'Basic realm="skillingup admin"');
    return res.status(401).send("Unauthorized");
  }
  try {
    const entries = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.send(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>skillingup / admin</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', monospace; background: #0A0A0A;
           color: #E5E5E5; padding: 40px; }
    h1 { color: #00FF87; letter-spacing: 3px; font-size: 16px;
         margin-bottom: 8px; }
    .meta { color: #555; font-size: 12px; margin-bottom: 32px; }
    .stat { display: inline-block; background: #111; border: 1px solid #222;
            padding: 12px 24px; margin-right: 12px; margin-bottom: 24px;
            border-radius: 4px; }
    .stat__num { font-size: 28px; color: #00FF87; font-weight: 700; }
    .stat__label { font-size: 10px; color: #555; letter-spacing: 2px;
                   margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { font-size: 10px; letter-spacing: 2px; color: #00FF87;
         border-bottom: 1px solid #222; padding: 10px 12px; text-align: left; }
    td { font-size: 12px; border-bottom: 1px solid #1A1A1A;
         padding: 10px 12px; color: #CCC; }
    tr:hover td { background: #111; }
    .empty { color: #444; font-size: 13px; padding: 40px 0; text-align: center; }
  </style>
</head>
<body>
  <h1>SKILLINGUP / EMAIL DASHBOARD</h1>
  <div class="meta">Letzter Reload: ${new Date().toLocaleString("de-DE")}</div>

  <div class="stat">
    <div class="stat__num">${entries.length}</div>
    <div class="stat__label">EMAILS GESAMT</div>
  </div>
  <div class="stat">
    <div class="stat__num">${
      entries.filter((e) => {
        const d = new Date(e.ts);
        const now = new Date();
        return now - d < 7 * 24 * 60 * 60 * 1000;
      }).length
    }</div>
    <div class="stat__label">LETZTE 7 TAGE</div>
  </div>

  ${
    entries.length === 0
      ? '<p class="empty">Noch keine Einträge.</p>'
      : `<table>
        <tr>
          <th>ZEITSTEMPEL</th>
          <th>EMAIL</th>
          <th>NAME</th>
          <th>BERUF</th>
          <th>JAHRE</th>
        </tr>
        ${entries
          .slice()
          .reverse()
          .map(
            (e) => `
          <tr>
            <td>${new Date(e.ts).toLocaleString("de-DE")}</td>
            <td>${e.email}</td>
            <td>${e.name || "–"}</td>
            <td>${e.job || "–"}</td>
            <td>${e.years || "–"}</td>
          </tr>
        `
          )
          .join("")}
      </table>`
  }
</body>
</html>`);
  } catch {
    res.status(500).send("Server error");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`skillingup running on :${PORT}`));
