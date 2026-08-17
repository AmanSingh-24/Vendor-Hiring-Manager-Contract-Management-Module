# Zelosify Recruit — Backend API & AI Engine

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)

This repository contains the Node.js / Express backend for **Zelosify Recruit**. It acts as the central hub for our multi-tenant SaaS, managing database operations via Prisma, enforcing Role-Based Access Control (RBAC) via Keycloak, and orchestrating the autonomous AI recommendation engine.

---

## Architecture Overview

1. **Service Layer Pattern**: All business logic is strictly decoupled from Express controllers.
2. **Multi-Tenant Isolation**: Prisma extensions/middlewares ensure that every database query automatically scopes to the authenticated user's `tenantId`.
3. **Agentic Pipeline (AI)**: We use **Groq (openai/gpt-oss-120b)** in a highly constrained tool-calling loop. Unlike brittle "LLM Wrappers", our engine relies on a deterministic TypeScript algorithm (Tool B) to calculate candidate scores, completely preventing AI hallucination.
4. **Stateless Auth**: Authentication relies exclusively on Keycloak-issued JWTs, transmitted via secure HTTP-Only cookies. 
5. **Direct-to-S3 Uploads**: We utilize Pre-signed URLs for resume uploads. The backend never buffers heavy PDF/PPTX files in memory, preventing Node.js event-loop blocking.
6. **Frontend Integration**: The backend seamlessly supports a fully responsive Next.js frontend (Desktop/Tablet/Mobile) by providing robust error handling states and empty data representations through structured JSON responses and appropriate HTTP status codes.

---

## Getting Started

### Prerequisites
- **Node.js**: v22+
- **Docker**: For running local Keycloak and PostgreSQL containers.

### 1. Start Infrastructure Services
The backend relies on PostgreSQL and Keycloak running locally via Docker Compose.

```bash
cd Server
docker compose up -d
```
> Wait until both containers are fully healthy before proceeding. You can verify Keycloak at `http://localhost:8080/auth`.

### 2. Install Dependencies
```bash
cd Server
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains valid credentials for:
- Database Connection (`DATABASE_URL`)
- Keycloak Realm settings
- AWS S3 Keys (`S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`)
- Groq API Key

### 4. Database Setup (Prisma)
Run the Prisma migrations to set up your PostgreSQL schema:
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

## The AI Recommendation Engine

The AI recommendation engine is located in `src/services/ai/`. It follows a strict 3-phase execution:

1. **`resumeParsingTool.ts`**: Natively parses uploaded PDF/PPTX buffers directly from S3 without relying on third-party API parsers.
2. **`matchingEngine.ts`**: The core deterministic engine. It executes a mathematical overlap algorithm against the extracted arrays and the required skills, completely bypassing the LLM for the actual scoring.
3. **`scoringEngineTool.ts`**: The orchestrator parses the deterministic score and uses the LLM solely to synthesize a human-readable rationale.

**To run the dedicated AI tests:**
```bash
npm test
```

---

## Security & Auth (Keycloak)

All secured routes must pass through our authentication middlewares located in `src/middlewares/auth/`:
- `authenticateUser`: Validates the JWT Bearer token extracted from the HTTP-Only cookie.
- `authorizeRole(['ROLE_NAME'])`: Asserts the authenticated user has the necessary Keycloak roles (e.g., `HIRING_MANAGER`, `IT_VENDOR`).

For initial registration, the system initiates a custom TOTP handshake using `otplib` before granting permanent credentials.

---

## 📁 Key Directories

```text
Zelosify-Backend/Server/
├── prisma/               # Database schema and migrations
├── src/
│   ├── controllers/      # Express route handlers
│   ├── middlewares/      # Security, Auth, and Error handling
│   ├── routers/          # Express route definitions
│   ├── services/
│   │   ├── ai/           # Groq Orchestrator, Tools, Deterministic Engine
│   │   ├── hiring/       # Hiring manager business logic
│   │   └── vendor/       # Vendor business logic
│   └── index.ts          # Entry point
└── tests/                # Vitest testing suite
```
