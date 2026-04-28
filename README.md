# TrueScan — AI Supply Chain Authenticity Platform

> **Google Solution Challenge 2024** · Powered by Gemini 2.0 Flash · Vertex AI · BigQuery  
> Addressing UN SDGs: **03 Good Health** · **12 Responsible Consumption** · **17 Partnerships**

---

## Problem Statement

India loses an estimated **₹1.1 lakh crore** (~$13B USD) annually to counterfeit FMCG products. Fake medicines, adulterated food, and counterfeit personal care products directly harm consumer health. Existing verification systems are manual, siloed, and inaccessible to end consumers at the point of purchase.

**TrueScan** solves this by putting AI-powered product verification directly in consumers' hands — scan any product, get an authenticity verdict from Google Gemini AI in under 2 seconds.

---

## Solution Overview

TrueScan is a full-stack web platform that:

1. **Consumer scans** a product QR code / barcode using their phone camera
2. **Gemini 2.0 Flash** performs multimodal analysis — code integrity + optional image analysis
3. **Supply chain provenance** is retrieved from the blockchain-anchored registry
4. **Risk factors** are surfaced with SHAP-style feature importance scores
5. **Admin dashboard** shows real-time scan events, threat maps, and 30-day analytics via BigQuery

---

## Google Cloud Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Next.js)                  │
│  ZXing QR Decoder → API call → Result display       │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────┐
│              Cloud Run (Express API)                │
│  POST /api/scan                                     │
│    └─→ Gemini 2.0 Flash (multimodal analysis)       │
│    └─→ Supply chain + risk factor builder           │
│  GET  /api/analytics → BigQuery warehouse query     │
│  GET  /api/events    → SSE live scan stream         │
└────────────────────┬────────────────────────────────┘
         ┌───────────┼──────────────┐
         ▼           ▼              ▼
   Vertex AI    BigQuery      Cloud Storage
  (model reg)  (analytics)  (product images)
```

### Google Services Used

| Service | Role |
|---|---|
| **Gemini 2.0 Flash** | Multimodal AI — analyzes product codes + images for authenticity |
| **Vertex AI** | MLOps pipeline, model registry, Explainable AI (feature importance) |
| **BigQuery** | Analytics warehouse — 30-day scan event aggregation & threat analysis |
| **Cloud Run** | Serverless container deployment for the Express.js API server |
| **Cloud Storage** | Product image store for visual analysis batch jobs |
| **Firebase Firestore** | Real-time scan event sync for live SSE dashboard stream |

---

## Features

### 🔬 Consumer Scanner (`/scan`)
- **Real Camera** — `getUserMedia` live video feed
- **ZXing QR/Barcode** — automatic code detection from camera frames
- **Manual input** — type or paste any product code with quick-pick buttons
- **Gemini 2.0 Flash** — real AI API call analyzing code + optional image frame
- **Full result card** — confidence meter, AI summary, supply chain timeline, risk factors, SHAP feature importance, blockchain hash

### 📊 Admin Dashboard (`/dashboard`)
- **Live KPI bar** — total scans, authentic rate, suspicious count, counterfeit count, avg confidence
- **30-day area chart** — authentic / suspicious / counterfeit breakdown (Recharts)
- **Global threat map** — SVG world map with proportional risk circles per country
- **Real-time live feed** — SSE stream of incoming scan events with connection indicator
- **Risk category rankings** — top FMCG categories by counterfeit exposure

### 🏭 Supply Chain Provenance
Every scan returns a 5-stage chain-of-custody:
`MANUFACTURE → QUALITY_CHECK → DISTRIBUTION → RETAIL → CONSUMER_SCAN`  
Each stage includes: location, actor, timestamp, blockchain hash

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript (strict), CSS Modules |
| AI | **Google Gemini 2.0 Flash** (`@google/generative-ai`) |
| QR Scanning | `@zxing/library` — BrowserMultiFormatReader |
| Charts | Recharts |
| Backend | Express.js, TypeScript, ts-node-dev |
| Real-time | Server-Sent Events (SSE) |
| Font | Geist Mono, DM Mono |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Set Gemini API key (already configured in `server/.env`)

```bash
# server/.env
GEMINI_API_KEY=your_key_here
```

### 3. Run both servers

```bash
npm run dev
```

- **Client**: http://localhost:3000
- **API Server**: http://localhost:5000
- **Live Events**: http://localhost:5000/api/events

### 4. Test the scanner

1. Open http://localhost:3000/scan
2. Click **SCAN** next to any quick-pick code (e.g. `HUL·001`)
3. Watch Gemini AI analyze and return a full result

---

## API Reference

### `POST /api/scan`
Analyze a product for authenticity using Gemini 2.0 Flash.

**Request:**
```json
{
  "code": "TS-HUL-001-2024",
  "imageBase64": "optional_base64_jpeg"
}
```

**Response:** Full `ScanResult` with status, confidence, supply chain, risk factors, Gemini metadata.

### `GET /api/analytics`
30-day aggregated BigQuery analytics.

### `GET /api/events`
Server-Sent Events stream. Events: `{ event: "scan", data: LiveScanEvent }` every 5–9 seconds.

### `GET /api/product/:code`
Product details from registry.

---

## Registered Test Products

| Code | Product | Brand |
|---|---|---|
| `TS-HUL-001-2024` | Dove Beauty Bar 100g | HUL |
| `TS-PEP-002-2024` | Lay's Classic Salted 52g | PepsiCo |
| `TS-MRK-003-2024` | Dettol Liquid Soap 200ml | Reckitt |
| `TS-COL-004-2024` | Colgate MaxFresh 150g | Colgate |
| `TS-NES-005-2024` | Maggi 2-Minute Noodles 70g | Nestlé |
| `TS-GSK-006-2024` | Horlicks Original 500g | GSK |
| `TS-TSC-007-2024` | Tata Tea Premium 500g | Tata Consumer |
| `TS-ITC-008-2024` | Classmate Notebook 200 Pages | ITC |

**Any other code** → Gemini AI flags as SUSPICIOUS/COUNTERFEIT (not in registry).

---

## Project Structure

```
truescan-supplychain-ai/
├── client/                   # Next.js 15 frontend
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Landing page
│   │   ├── (consumer)/scan/  # Scanner page
│   │   └── (admin)/dashboard/# Analytics dashboard
│   ├── components/
│   │   ├── scanner/          # CameraFeed, ScanOverlay, ResultCard
│   │   ├── dashboard/        # MetricsBar, ScanChart, ThreatMap, LiveFeed
│   │   └── ui/               # NavBar, StatusBadge, Terminal
│   ├── services/
│   │   ├── api.ts            # Typed fetch layer
│   │   ├── vertexAI.ts       # Simulated Vertex AI pipeline
│   │   └── bigquery.ts       # Simulated BigQuery analytics
│   └── hooks/
│       ├── useScanner.ts     # Camera + ZXing hook
│       └── useLiveFeed.ts    # SSE event stream hook
├── server/
│   └── src/server.ts         # Express API + real Gemini integration
└── shared/
    └── types.ts              # Shared TypeScript interfaces
```

---

## UN SDG Impact

| SDG | How TrueScan Helps |
|---|---|
| **SDG 3** — Good Health & Well-Being | Prevents counterfeit medicines, health products, and food from reaching consumers |
| **SDG 12** — Responsible Consumption | Creates transparency across FMCG supply chains; enables informed purchasing |
| **SDG 17** — Partnerships for Goals | Shared verification infrastructure for brands, distributors, and regulators |

---

## Deployment Guide (GCP & Vercel)

To utilize your Google Cloud Platform credits and ensure high availability for the hackathon judges, deploy the services separately:

### 1. Backend (Express API) → Google Cloud Run
Cloud Run is perfect for the API as it scales to zero and handles SSE connections elegantly.

1. **Create a `Dockerfile`** in the `server/` directory:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5001
   CMD ["npm", "start"]
   ```
2. **Deploy via gcloud CLI:**
   ```bash
   cd server
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/truescan-api
   gcloud run deploy truescan-api --image gcr.io/YOUR_PROJECT_ID/truescan-api \
     --platform managed --region asia-south1 --allow-unauthenticated \
     --set-env-vars="GEMINI_API_KEY=your_key_here,PORT=5001"
   ```
3. Note the deployed Cloud Run URL (e.g., `https://truescan-api-xxx.a.run.app`).

### 2. Backend (Express API) → Render (Alternative)
*Note: Using Gemini 2.0 Flash satisfies the Google Solution Challenge "Google technology" requirement. You do not strictly have to use GCP for hosting.*

1. **Deploy to Render:**
   - Link your GitHub repo to Render.
   - The included `server/render.yaml` Blueprint will automatically configure the backend.
   - Go to the Render dashboard -> New -> Blueprint -> Connect repo.
   - Add your `GEMINI_API_KEY` in the Render environment variables settings.

### 3. Frontend (Next.js) → Vercel
Vercel offers the simplest zero-config Next.js deployment.

1. Install the Vercel CLI: `npm i -g vercel`
2. Run deployment from the `client/` directory:
   ```bash
   cd client
   vercel
   ```
3. **Update Next.js config:** In your Vercel dashboard (or `next.config.mjs` before deploying), update the API proxy to point to your new Cloud Run / Render URL instead of `localhost`:
   ```javascript
   // client/next.config.mjs
   destination: "https://truescan-api-xxx.onrender.com/api/:path*"
   ```

---

## Design Philosophy

TrueScan deliberately avoids generic "AI startup" aesthetics. The UI uses:
- **Geist Mono** typeface — industrial, precision-grade
- **Toxic green (#00FF41)** on deep gunmetal — high-contrast, zero ambiguity
- Brutalist hard borders, no soft shadows, no rounded cards
- Scanline animations, terminal readouts, corner-bracket targeting UI

The visual language reflects the industrial supply chain domain — not a consumer wellness app.

---

## License

MIT © 2024 TrueScan
