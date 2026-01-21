const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const inventoryData = [
  { location: "Regal A1", item: "NFC-Tag 001", status: "In Nutzung" },
  { location: "Regal B2", item: "NFC-Tag 014", status: "Eingelagert" },
  { location: "Regal C3", item: "NFC-Tag 023", status: "Versandbereit" },
  { location: "Regal D4", item: "NFC-Tag 045", status: "Wartung" }
];

const logEntries = [
  {
    message: "Warenausgang bestätigt: NFC-Tag 023",
    time: "vor 3 Minuten"
  },
  {
    message: "Umlagerung abgeschlossen: Regal A1 → C3",
    time: "vor 12 Minuten"
  },
  {
    message: "Neuer Wareneingang: NFC-Tag 045",
    time: "vor 25 Minuten"
  }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/inventory", (req, res) => {
  res.json({ data: inventoryData });
});

app.get("/api/logs", (req, res) => {
  res.json({ data: logEntries });
});

app.post("/api/scan", (req, res) => {
  const id = `NFC-${Math.floor(Math.random() * 900 + 100)}`;
  const location = inventoryData[Math.floor(Math.random() * inventoryData.length)].location;
  const entry = {
    message: `Scan erkannt: ${id} (${location})`,
    time: "gerade eben"
  };

  logEntries.unshift(entry);
  if (logEntries.length > 5) {
    logEntries.pop();
  }

  res.json({
    id,
    location,
    time: new Date().toLocaleTimeString("de-DE"),
    logEntry: entry
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
