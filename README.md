# NFC Lagersystem – Web-Prototyp

Dieser Prototyp liefert ein kleines Backend und eine Tailwind-basierte Weboberfläche für ein NFC-basiertes Lagersystem. Die UI spricht ein einfaches JSON-API an und zeigt Scan-Ereignisse, Bestände und ein Bewegungsprotokoll.

## Projektstruktur

```
public/
  index.html   # Tailwind UI, hier kannst du deine Seiten anpassen
  app.js       # Frontend-Logik (API-Aufrufe, UI-Updates)
server.js      # Express-Backend mit Mock-Daten
```

## Starten

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Server starten:

```bash
npm start
```

3. Öffne `http://localhost:3000` im Browser.

## API (Mock)

- `GET /api/health`
- `GET /api/inventory`
- `GET /api/logs`
- `POST /api/scan`
