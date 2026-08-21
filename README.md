# NextTrack Command Center

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https.mit-license.org)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646cff.svg)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4.19-000000.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248.svg)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com)

> **Enterprise ESP32 LoRa Mesh Telemetry Router, Emergency Response & Attendance Management System**

NextTrack is a full-stack real-time telemetry monitoring and management platform designed to ingest, process, resolve, and audit event streams emitted across distributed ESP32 LoRa mesh networks.

It provides immediate sub-second visual and acoustic dispatch alerts for critical SOS emergencies, automates NFC cardholder check-in resolution, maintains historical audit compliance logs with multi-format export capabilities (CSV/Excel), and exposes real-time WebSocket state distribution to operational command personnel.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Key Platform Features](#key-platform-features)
- [Technology Stack](#technology-stack)
- [Hardware & Firmware Integration Specs](#hardware--firmware-integration-specs)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Manual Local Development](#manual-local-development)
  - [Docker Compose Deployment](#docker-compose-deployment)
- [Default System Credentials](#default-system-credentials)
- [API & Ingestion Specification](#api--ingestion-specification)
- [Environment Configuration](#environment-configuration)
- [Directory Layout](#directory-layout)
- [Verification & Operational Testing](#verification--operational-testing)
- [License](#license)

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│             ESP32 Field Pole Nodes (A, B)              │
│    PN532 NFC Tap Reader  │  SOS Emergency Button       │
└───────────────────────────┬────────────────────────────┘
                            │ LoRa 433MHz Mesh Protocol
                            ▼
┌────────────────────────────────────────────────────────┐
│               ESP32 Receiver MAIN Node                 │
│      Packet De-encapsulation & Local Screen            │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST Webhook Payload
                            ▼
┌────────────────────────────────────────────────────────┐
│             n8n Automation & Router Engine             │
│       Alert Dispatch (Telegram) & Normalization        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST (Header: x-api-key)
                            ▼
┌────────────────────────────────────────────────────────┐
│               NextTrack Express Backend                │
│    JWT Auth │ MongoDB Storage │ Socket.io Broadcaster      │
└───────────────────────────┬────────────────────────────┘
                            │ WebSocket / REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│            NextTrack React Command Dashboard           │
│     Live Telemetry Feed │ SOS Banners │ Audit Logs         │
└────────────────────────────────────────────────────────┘
```

---

## Key Platform Features

- **Real-Time Emergency Dispatch**: Sub-second visual alert overlays coupled with browser-synthesized dual-tone acoustic chimes (B5 ➔ E6 ➔ A6 ascending wave) upon SOS payload detection.
- **Bi-Directional Telemetry Streaming**: Socket.io WebSocket architecture ensuring live status updates across all connected command dashboards without polling.
- **NFC Directory Resolution**: Centralized database mapping raw 4-byte and 7-byte physical NFC UIDs to verified cardholder profiles for automated attendance verification.
- **Audit Logging & Compliance Filter**: Complete historical record of network transmissions filterable by event type (`SOS`, `CHECKIN`, `UNKNOWN_CARD`, `MESSAGE`), origin node ID (`A`, `B`), and custom date bounds.
- **Multi-Format Export Engine**: One-click generation and streaming of audit datasets into raw CSV files or fully formatted Microsoft Excel spreadsheets (`.xls` / `.xlsx`).
- **Telemetry Simulation Engine**: Integrated navbar test trigger enabling operators to validate webhook ingestion, alerting pipelines, and audio alerts without physical hardware.
- **Metrics & Node Diagnostics**: Live tracking of event volumes, average SOS resolution times, and network node connectivity health.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite 5, Tailwind CSS | High-performance SPA with dynamic glassmorphism aesthetics |
| **Icons & Audio** | Lucide React, Web Audio API | Vector interface icons & client-side dual-tone sound synthesis |
| **Backend API** | Node.js, Express.js | Modular REST server with JWT & API key middleware authentication |
| **Real-Time Layer**| Socket.io | Bidirectional WebSocket event broadcasting |
| **Database** | MongoDB, Mongoose | Schema-enforced document storage for events, users, and card mappings |
| **Containerization**| Docker, Docker Compose | Production-ready multi-container orchestration |

---

## Hardware & Firmware Integration Specs

### LoRa Frame Format (Plain Text, Pipe-Delimited)

```
SRC=<SourceID>|PATH=<HopHistory>|DEST=<DestinationID>|DATA=<Payload>
```

- **Source ID (`SRC`)**: Identifier of transmitting pole (e.g., `A`, `B`).
- **Path (`PATH`)**: Node hop history string (e.g., `A->B->MAIN`).
- **Destination ID (`DEST`)**: Target node identifier (e.g., `MAIN`).
- **Payload (`DATA`)**:
  - `SOS`: Emergency call button activation.
  - `UID:AA:BB:CC:DD`: Raw NFC tap payload.
  - `<Text>`: Captive portal message string (≤ 150 chars).

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Installed locally (`mongodb://localhost:27017`) or a remote MongoDB Atlas cluster URI.
- **Docker & Docker Compose**: *(Optional)* Required for containerized deployment.

---

### Manual Local Development

#### 1. Repository Initialization
```bash
git clone https://github.com/Nevid-786/NextTrack.git
cd NextTrack
```

#### 2. Backend Configuration & Launch
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` root:
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nexttrack
JWT_SECRET=nexttrack_secure_jwt_secret_token_2026
DEVICE_API_KEY=nexttrack_device_secret_key_9988
FRONTEND_URL=http://localhost:3000,http://localhost:5173
CORS_ORIGIN=*
```

Start the backend application:
```bash
npm run dev
```
*Backend API will initialize at `http://localhost:4000`.*

#### 3. Frontend Configuration & Launch
In a separate terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

Start the frontend application:
```bash
npm run dev
```
*Frontend interface will initialize at `http://localhost:5173` (or `http://localhost:3000`).*

---

### Docker Compose Deployment

To build and run all services (MongoDB, Express API, Vite Frontend) in isolated Docker containers:

```bash
docker-compose up --build -d
```

#### Exposed Ports & Services:
- **Frontend Command Center**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:4000`
- **MongoDB Instance**: `localhost:27017`

To shut down all running services:
```bash
docker-compose down
```

---

## Default System Credentials

On initial database boot, the backend automatically seeds a default system administrator account if no users exist:

| Attribute | Credentials |
| :--- | :--- |
| **System Role** | `admin` (System Commander) |
| **Email Address** | `admin@nexttrack.io` |
| **Default Password** | `Admin@123456` |

---

## API & Ingestion Specification

### Telemetry Ingestion Endpoint

Used by external integration layers (e.g., n8n, microservices, edge routers) to ingest device events.

```http
POST /api/events
Content-Type: application/json
x-api-key: nexttrack_device_secret_key_9988
```

#### Request Payload Examples

##### 1. SOS Emergency Alert
```json
{
  "poleId": "A",
  "path": "A->MAIN",
  "type": "SOS",
  "rawData": "SOS"
}
```

##### 2. NFC Card Attendance Tap
```json
{
  "poleId": "B",
  "path": "B->MAIN",
  "type": "CHECKIN",
  "rawData": "UID:11:22:33:44"
}
```

##### 3. Captive Portal Message
```json
{
  "poleId": "A",
  "path": "A->B->MAIN",
  "type": "MESSAGE",
  "rawData": "Requesting medical check at Pole A"
}
```

---

## Environment Configuration

### Backend Environment Variables (`/backend/.env`)

| Variable Key | Required | Type | Description | Default |
| :--- | :---: | :---: | :--- | :--- |
| `PORT` | Optional | Number | Express HTTP listening port | `4000` |
| `NODE_ENV` | Optional | String | Environment execution target | `development` |
| `MONGODB_URI` | **Required** | String | MongoDB connection URI | `mongodb://localhost:27017/nexttrack` |
| `JWT_SECRET` | **Required** | String | Secret key for signing user auth tokens | *(auto-generated)* |
| `DEVICE_API_KEY` | **Required** | String | Security key for `x-api-key` header validation | `nexttrack_device_secret_key_9988` |
| `FRONTEND_URL` | Optional | String | Allowed CORS origins (comma-delimited) | `http://localhost:3000` |

### Frontend Environment Variables (`/frontend/.env`)

| Variable Key | Required | Type | Description | Default |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_API_URL` | **Required** | String | Base HTTP endpoint for backend API | `http://localhost:4000/api` |
| `VITE_SOCKET_URL` | **Required** | String | Base WebSocket endpoint for Socket.io | `http://localhost:4000` |

---

## Directory Layout

```
NextTrack/
├── backend/
│   ├── src/
│   │   ├── config/           # Database initialization & env specs
│   │   ├── controllers/      # Business logic handlers (Events, Auth, Cards, Analytics)
│   │   ├── middleware/       # JWT verification & API Key security
│   │   ├── models/           # Mongoose schemas (Event, User, CardMapping, Pole)
│   │   ├── routes/           # REST endpoint definitions
│   │   ├── sockets/          # Socket.io connection & broadcasting logic
│   │   ├── utils/            # Hex UID normalization algorithms
│   │   ├── app.js            # Express application setup
│   │   └── server.js         # Process bootstrapper
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance & service abstractions
│   │   ├── components/       # Reusable components (SosBanner, Tables, ExportButton)
│   │   ├── context/          # React Auth Context & State Provider
│   │   ├── pages/            # View pages (Dashboard, History, Directory, Analytics, Settings)
│   │   ├── socket/           # Client-side Socket.io handlers
│   │   ├── utils/            # Audio synthesizer utilities (`audio.js`)
│   │   └── App.jsx           # Root layout & route configuration
│   ├── Dockerfile
│   └── package.json
│
├── architecture/             # Technical specifications & design docs
├── docker-compose.yml        # Container orchestration manifest
└── README.md                 # System documentation
```

---

## Verification & Operational Testing

1. Launch both backend and frontend applications using `npm run dev` or `docker-compose up`.
2. Access the command dashboard at `http://localhost:5173` or `http://localhost:3000`.
3. Authenticate using `admin@nexttrack.io` / `Admin@123456`.
4. Trigger a simulated emergency by clicking **🚨 Trigger Test SOS** in the top navigation bar.
5. Verify:
   - Immediate rendering of the active emergency overlay banner.
   - Dispatch of the acoustic dual-tone alert chime.
   - Real-time update of telemetry counters.
6. Navigate to **Audit History** to test search filtering and verify instant file downloads for both **Export CSV** and **Export Excel**.

---

## License

This project is licensed under the [MIT License](LICENSE).
