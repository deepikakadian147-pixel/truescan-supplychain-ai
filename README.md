# TRUESCAN — AI-Powered Authenticity Layer for Smart Supply Chains

## 🚀 Overview

TrueScan is a full-stack AI system that transforms a standard camera into a **real-time product authenticity verification engine**.

It introduces a missing layer in modern supply chains:

> **Trust.**

---

## 🌍 Problem

Smart supply chains optimize:

* speed
* cost
* logistics

But fail at:

* product authenticity verification
* counterfeit detection
* real-time fraud intelligence

### ⚠️ Result

* Fake FMCG products enter markets
* Consumers are exposed to unsafe goods
* Companies lose revenue and trust

---

## 💡 Solution

TrueScan introduces an **AI-powered verification pipeline**:

```
Camera → Vision AI → Vertex AI → BigQuery → Decision Engine
```

It enables:

* real-time scanning
* anomaly detection
* authenticity scoring

---

## 🧠 Architecture

```
Frontend (Next.js / React)
        ↓
Node.js Backend (Express API)
        ↓
Google Cloud Services
   ├── Vision API (OCR)
   ├── Vertex AI (ML inference)
   └── BigQuery (fraud analytics)
```

---

## 🔍 Features

### 🎥 Camera-Based Scanning

* Uses WebRTC camera feed
* Captures product frames
* No external hardware required

---

### 🧠 AI Verification Engine

* OCR-based label detection
* Texture anomaly simulation
* Confidence scoring system

---

### 🌍 Fraud Detection (BigQuery Logic)

* Detects geographic inconsistencies
* Identifies suspicious scan patterns
* Flags anomalies in real-time

---

### 📊 Admin Dashboard (Extendable)

* Scan analytics
* Fraud visibility
* System monitoring

---

## 🧩 Tech Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Frontend  | Next.js (React)                |
| Backend   | Node.js (Express)              |
| AI Layer  | Google Vision API (extendable) |
| ML        | Vertex AI (simulated)          |
| Analytics | BigQuery                       |
| Language  | TypeScript                     |

---

## 📁 Project Structure

```
client/     → React UI
server/     → Node.js backend
shared/     → Types
```

---

## ⚙️ Getting Started

### 1. Clone Repository

```
git clone https://github.com/your-username/truescan-supplychain-ai.git
cd truescan-supplychain-ai
```

---

### 2. Run Backend

```
cd server
npm install
npm run dev
```

---

### 3. Run Frontend

```
cd client
npm install
npm run dev
```

---

### 4. Open App

```
http://localhost:3000
```

---

## 🧪 Prototype Capabilities

* Scan product using camera
* Run AI-based authenticity logic
* Detect anomalies
* Return structured result

---

## 📈 Impact

### For Businesses

* Reduce counterfeit penetration
* Improve supply chain trust
* Enable real-time verification

### For Consumers

* Instant product authenticity check
* Increased safety and trust

---

## 🔮 Future Scope

* Real Vertex AI deployment
* Google Maps fraud heatmap
* Blockchain-based product identity
* Real-time alert system
* ERP / SAP integration

---

## 🧠 Engineering Philosophy

* Treat camera as a **sensor**
* Replace static checks with **AI-driven decisions**
* Design for **scale + observability**
* Build systems, not just apps

---

## 🏁 Conclusion

TrueScan is not just a scanner.

> It is a **distributed authenticity infrastructure for the future of smart supply chains**.

---

## 📄 License

MIT
