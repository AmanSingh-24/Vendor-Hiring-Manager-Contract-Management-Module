# Zelosify Recruit — Enterprise AI Hiring Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=nodedotjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-IAM-4D4D4D?style=flat&logo=keycloak&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-Storage-FF9900?style=flat&logo=amazons3&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

A production-grade, multi-tenant recruitment platform that streamlines vendor candidate submission, deterministic AI-powered resume evaluation, and hiring manager decision workflows — all secured by strict Role-Based Access Control (RBAC) and Keycloak IAM.

---

## 📖 Table of Contents

1. [Problem Statement & Objective](#problem-statement--objective)
2. [System Architecture](#system-architecture)
   - [AI Recommendation Orchestrator](#1-3-phase-ai-recommendation-orchestrator)
   - [Secure User Onboarding & 2FA Flow](#2-secure-user-onboarding--2fa-flow)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Getting Started (Quick Setup)](#getting-started-quick-setup)
6. [Repository Structure](#repository-structure)

---

## 🎯 Problem Statement & Objective

Enterprise recruitment workflows are often fragmented. Vendors submit CVs via email, hiring managers manually grade them, and no centralized audit trail exists. Worse, implementing AI often results in "LLM Wrappers" that hallucinate scores and cannot be mathematically audited.

**Zelosify Recruit** solves this by providing a unified SaaS platform where:
- **IT Vendors** securely submit PDF/PPTX resumes via pre-signed S3 URLs.
- A **3-Phase Agentic AI Pipeline** parses resumes and mathematically scores them using a **Deterministic Matching Engine** (zero hallucination).
- **Hiring Managers** review the transparent, AI-generated reasoning and shortlist candidates.
- Everything is heavily gated by **Tenant-Isolation** and **Keycloak 2FA**.

---

## 🏗️ System Architecture

### 1. 3-Phase AI Recommendation Orchestrator
Our AI system is not a simple LLM wrapper. It uses a strict tool-calling loop where the LLM is only used for text extraction and reasoning, while the actual scoring is done by a mathematically deterministic TypeScript engine.

![AI Recommendation Architecture](./Zelosify-Frontend/public/assets/architecture.png)

### 2. Secure User Onboarding & 2FA Flow
Our authentication flow is backed by a Dockerized Keycloak server, utilizing TOTP generation (`otplib`) and strictly HTTP-Only secure cookies to prevent XSS attacks.

#### Registration Flow
```mermaid
sequenceDiagram
    autonumber
    actor U as New User
    participant F as Next.js Frontend
    participant B as Node.js Backend
    participant K as Dockerized Keycloak
    participant GA as Google Authenticator

    %% Registration & Initial Auth
    U->>F: Submits Registration Details
    F->>B: POST /register
    B->>K: Create User Identity (Admin API)
    B->>K: Authenticate to fetch initial JWTs
    K-->>B: Returns secure JWTs
    
    %% 2FA Setup
    B->>B: Generate TOTP Secret (otplib)
    B-->>F: Sets JWT Cookies + registration_token="pending"<br/>Returns Base64 QR Code
    F-->>U: Displays QR Code on screen
    
    %% Verification Loop
    U->>GA: Scans QR Code with phone
    GA-->>U: Displays 1st 6-digit code
    U->>F: Enters 6-digit TOTP code
    F->>B: POST /verify-totp
    B->>B: Validates TOTP code mathematically
    B-->>F: Success! Clears registration_token cookie
    F->>U: Unlocks & Routes to Role-Based Dashboard
```

#### Login Flow
```mermaid
sequenceDiagram
    autonumber
    actor U as Returning User
    participant GA as Google Authenticator
    participant F as Next.js Frontend
    participant B as Node.js Backend
    participant K as Dockerized Keycloak

    U->>GA: Opens app on phone
    GA-->>U: Displays live 6-digit code
    U->>F: Submits Email, Password & TOTP Code
    F->>B: POST /login

    B->>B: 1. Verify TOTP Code (otplib)
    
    alt TOTP is Valid
        B->>K: 2. Authenticate Password
        K-->>B: Returns secure JWTs
        B-->>F: 3. Set HTTP-Only Cookies <br/> (access_token, refresh_token, role)
        F->>U: Route to secure Role-Based Dashboard
    else TOTP is Invalid
        B-->>F: 401 Unauthorized
        F-->>U: Deny Access (Display Error)
    end
```

---

## ✨ Key Features

- **Strict Multi-Tenancy:** Prisma middleware and API route guards ensure data is 100% isolated by `tenantId`.
- **Dynamic Tool-Calling Agent:** Groq (Llama 3.1) autonomously orchestrates native PDF and PPTX parsing tools without external third-party parsing dependencies.
- **Deterministic Math Engine:** The LLM does NOT calculate the score. All matching is handled deterministically by a hardcoded TypeScript engine, preventing hallucinations.
- **Enterprise IAM:** Full integration with Keycloak (Dockerized), TOTP Authenticator apps, and strict HTTP-Only cookie management.
- **High Observability:** Structured JSON logging captures LLM token usage, latency (ms), and persistence of reasoning metadata inside PostgreSQL.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 15, React 19, Tailwind CSS | UI, SSR/CSR, and styling |
| **Backend** | Node.js 22, Express, TypeScript 5 | REST API and Agent Orchestration |
| **Database & ORM** | PostgreSQL 15, Prisma | Multi-tenant relational data store |
| **Identity & Security** | Keycloak, JWT, `otplib` | OIDC SSO, session management, 2FA |
| **Storage** | AWS S3 (Pre-signed URLs) | Secure, backend-bypassed resume uploads |
| **AI / Inference** | Groq (Llama 3.1) | Low-latency tool-calling agent |

---

## 🚀 Getting Started (Quick Setup)

1. **Boot Infrastructure:**
   ```bash
   cd Zelosify-Backend/Server
   docker-compose up -d
   ```
2. **Start the Backend:**
   ```bash
   npm install
   npm run prisma:migrate
   npm run dev
   ```
3. **Start the Frontend:**
   ```bash
   cd ../../Zelosify-Frontend
   npm install
   npm run dev
   ```

*(For detailed setup and API documentation, please refer to the specific READMEs inside the Frontend and Backend folders).*

---

## 📂 Repository Structure

- `Zelosify-Backend/` - Contains the Express.js server, Prisma schemas, and the 3-Phase AI Orchestrator.
- `Zelosify-Frontend/` - Contains the Next.js application, React components, and Role-Based Dashboards.
