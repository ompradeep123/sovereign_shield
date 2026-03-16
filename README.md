# SovereignShield - Zero-Trust E-Governance Platform (V3)

SovereignShield is a production-grade cybersecurity prototype for national e-governance, built with a **Zero-Trust Architecture** and **Privacy-First** principles. It demonstrates a resilient cloud infrastructure that integrates decentralized identity, blockchain integrity, and real-time threat monitoring.

## 🏗 Cloud-Native Architecture V3

The platform follows a decoupled, secure, and scalable multi-cloud design:

- **Frontend**: React (Vite) deployed on **Vercel** with SPA routing resilience.
- **Security Gateway**: Node.js Express cluster (Railway/Render) with centralized policy enforcement.
- **Identity & Data**: **Supabase** (PostgreSQL + Auth) for secure IAM and PII-audited storage.
- **Immutable Ledger**: **Polygon Amoy Testnet** for cryptographic document verification.
- **Monitoring SIEM**: National Threat Radar for live DDoS and intrusion detection.

## 🔐 Core Security Features

1.  **API Security Gateway**:
    - **Rate Limiting**: Automatic DoS/Brute-force protection (Max 100 reqs/15m).
    - **Header Hardening**: Integrated `helmet` and production-grade CORS policies.
    - **Unified IAM**: Cross-microservice authentication sharing via Supabase JWTs.

2.  **Privacy & Transparency**:
    - **Zero-Knowledge Proofs (ZKP)**: Verify citizen eligibility (Age, Citizenship) without exposing PII.
    - **Trust Timeline**: A transparent audit trail for citizens showing exactly which government services accessed their data.
    - **Data Access Tagging**: Granular logging of accessed attributes (e.g., `[DATA_ACCESSED: Financial Records]`).

3.  **Resilience & DR**:
    - **Hot-Standby Failover**: Backend logic supports multi-node failover simulation.
    - **Cloud Health Heartbeats**: Real-time observability via the `/api/health` gateway endpoint.
    - **Blockchain Verify**: Real-time integrity checks between database states and the Polygon Ledger.

## 🚀 Deployment

### Backend Setup
1.  Navigate to `/backend`
2.  `npm install`
3.  Configure `.env` with Supabase and Polygon keys.
4.  `npm start` (or deploy via `Dockerfile`).

### Frontend Setup
1.  Navigate to `/frontend`
2.  `npm install`
3.  Set `VITE_API_BASE_URL` to your cloud backend.
4.  `npm run build` (optimized for Vercel).

---
*Built for the National Cybersecurity Hackathon 2026 - SovereignShield Team.*
# SovereignShield Trigger
# Monorepo Fix
# Path Correction
