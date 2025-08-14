# Dehkhoda Smoke Visualizer - Ready bundle

This repository contains a **frontend** (Vite + React) and a **server** (Node/Express) starter
pre-configured to load `dehkoda_farms.csv` in `frontend/public/` and call a simple forecast API.

## What's included
- `frontend/` - React app. Run `npm install` then `npm run dev` to test locally.
- `frontend/public/dehkoda_farms.csv` - your farm centroids (WGS84) extracted from your Excel.
- `server/` - Express server with `/api/forecast` proxy to Open-Meteo.
- `server/service-account.json` - (ONLY IF it existed in /mnt/data) **Service account JSON was copied for convenience**. 
  **Important security note**: Do NOT commit this file to a public repo. Use environment secrets in production.

## Quick local run (recommended)
### Frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

### Server
```bash
cd server
npm install
node index.js
# server at http://localhost:8080
```

## Deploying
- Deploy server to Render / Cloud Run / Heroku (use Dockerfile if you like).
- Deploy frontend to Vercel / Netlify. Set `REACT_APP_API_URL` to your server URL if needed.

## Security
- Remove `server/service-account.json` before pushing to a public repo. Instead, put the JSON content into Render/Cloud Run secret manager and read it in server via env var or mounted secret.

"# dehkoda-smoke-visualizer"  
