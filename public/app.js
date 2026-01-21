const scanId = document.getElementById("scan-id");
const scanMeta = document.getElementById("scan-meta");
const inventory = document.getElementById("inventory");
const log = document.getElementById("log");
const scanButton = document.getElementById("simulate-scan");

const fallbackInventory = [
  { location: "Regal A1", item: "NFC-Tag 001", status: "In Nutzung" },
  { location: "Regal B2", item: "NFC-Tag 014", status: "Eingelagert" },
  { location: "Regal C3", item: "NFC-Tag 023", status: "Versandbereit" },
  { location: "Regal D4", item: "NFC-Tag 045", status: "Wartung" }
];

const fallbackLog = [
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

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function renderInventory(items) {
  inventory.innerHTML = "";
  items.forEach((entry) => {
    const row = document.createElement("div");
    row.className =
      "flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";
    row.innerHTML = `<div>${entry.location}</div><span class="font-semibold">${entry.status}</span>`;
    row.title = entry.item;
    inventory.appendChild(row);
  });
}

function renderLog(entries) {
  log.innerHTML = "";
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className =
      "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700";
    item.innerHTML = `<strong class="block text-slate-900">${entry.message}</strong><time class="text-xs text-slate-500">${entry.time}</time>`;
    log.appendChild(item);
  });
}

async function loadDashboard() {
  try {
    const [inventoryResponse, logResponse] = await Promise.all([
      fetchJson("/api/inventory"),
      fetchJson("/api/logs")
    ]);
    renderInventory(inventoryResponse.data);
    renderLog(logResponse.data);
  } catch (error) {
    renderInventory(fallbackInventory);
    renderLog(fallbackLog);
    scanMeta.textContent = "Lokale Daten geladen (Backend nicht erreichbar).";
  }
}

function buildLocalScan() {
  const id = `NFC-${Math.floor(Math.random() * 900 + 100)}`;
  const location = fallbackInventory[Math.floor(Math.random() * fallbackInventory.length)].location;
  const time = new Date().toLocaleTimeString("de-DE");
  const entry = {
    message: `Scan erkannt: ${id} (${location})`,
    time: "gerade eben"
  };

  fallbackLog.unshift(entry);
  if (fallbackLog.length > 5) {
    fallbackLog.pop();
  }

  return { id, location, time, entry };
}

async function simulateScan() {
  scanButton.disabled = true;
  scanButton.classList.add("opacity-60", "cursor-not-allowed");

  try {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Scan fehlgeschlagen");
    }

    const data = await response.json();
    scanId.textContent = data.id;
    scanMeta.textContent = `Erfasst an ${data.location} · ${data.time}`;

    const logResponse = await fetchJson("/api/logs");
    renderLog(logResponse.data);
  } catch (error) {
    const local = buildLocalScan();
    scanId.textContent = local.id;
    scanMeta.textContent = `Erfasst an ${local.location} · ${local.time}`;
    renderLog(fallbackLog);
  } finally {
    scanButton.disabled = false;
    scanButton.classList.remove("opacity-60", "cursor-not-allowed");
  }
}

scanButton.addEventListener("click", simulateScan);
loadDashboard();
