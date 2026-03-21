# SpaceLink AI 🚀

**SpaceLink AI** is an intelligent ecosystem matchmaking platform designed specifically for the modern space industry. It utilizes a neural matching engine to connect aerospace engineers, orbital startups, satellite enterprises, and space-focused investors based on technical synergy and project requirements.

![SpaceLink AI Preview](https://img.shields.io/badge/Status-Beta-purple)
![SpaceLink AI Tech](https://img.shields.io/badge/Stack-MERN-blue)
![SpaceLink AI i18n](https://img.shields.io/badge/i18n-EN%20%7C%20TR-green)

---

## 🌌 Core Features

- **Neural Matching Engine**: Proprietary AI (Weighted Jaccard Similarity) that analyzes skills and interests to find the perfect technical partners.
- **Mission Directory**: A centralized hub for active orbital projects, payloads, and subsystems.
- **Real-time Messaging**: Secure communication threads between matched entities.
- **Internationalization (i18n)**: Native support for English and Turkish languages with real-time UI switching.
- **Celestial Dashboard**: A high-fidelity, glassmorphism-inspired UI ("Celestial Architect") providing a 360-degree overview of your orbital networking status.
- **Dynamic Profiles**: Skill-based telemetry and experience tracking for the aerospace workforce.

---

## 🏗️ Project Structure

The project follows a modular full-stack architecture:

```text
SpaceLink-AI/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Individual screen definitions
│   │   ├── context/        # Auth and global state
│   │   ├── locales/        # i18n (EN/TR) translation dictionaries
│   │   └── api.js          # Axios client with JWT interceptors
│   └── index.html          # Entry point
├── server/                 # Backend (Node.js + Express)
│   ├── models/             # Mongoose schemas (User, Project, Message)
│   ├── routes/             # API endpoints (Auth, Matches, Projects, etc.)
│   ├── middleware/         # Auth guards and Language parsing
│   ├── config/             # DB & Server configuration
│   └── seed.js             # Mock data generation script
└── stitch/                 # Design assets and original styleguide
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, i18next, Vanilla CSS (Celestial Architect Design System).
- **Backend**: Node.js, Express, JWT, Bcrypt.
- **Database**: MongoDB + Mongoose.
- **Icons**: Google Material Symbols.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or via Atlas)

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
*Note: Create a `.env` file with `MONGO_URI`, `JWT_SECRET`, and `PORT=5001`.*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Database Seeding
To populate the application with mock space-industry data:
```bash
cd server
node seed.js
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**SpaceLink AI** — *Pioneering the Orbital Economy through intelligent connections.*
