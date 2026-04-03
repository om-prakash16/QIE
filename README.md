<div align="center">
  <img src="https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  
  <br />
  <br />

  <h1>🚀 Skillsutra</h1>
  <h3>The Ultimate AI-Powered Web3 Talent Marketplace</h3>
  
  <p align="center">
    <b>A disruptive decentralized SaaS platform merging Artificial Intelligence (LangChain + OpenAI) with Solana Web3 to guarantee immutable resume verification, dynamic skill NFTs, and flawless job matching.</b>
  </p>

</div>

---

## 🌟 The Vision

**Skillsutra** bridges the trust gap between elite candidates and world-class companies. By moving resumes from static PDFs into dynamic, AI-verified, on-chain assets, we make the hiring process completely transparent, verifiable, and instantly matched.

> *LinkedIn shows claims. Skillsutra proves skills.*

## 🏆 Hackathon-Winning Features

### 🚀 Solana Blinks / Actions (Twitter-Native Hiring) ⭐⭐⭐
- **Direct Apply from Socials:** Recruiter shares a job on X (Twitter), and candidates apply directly via the tweet using Solana Actions. No extra clicks.
- **Spec-Compliant Backend:** Full metadata support for Solana Action discovery and transaction serialization.

### 🎭 Dynamic Profile Engine & Templates ⭐⭐⭐
- **Admin-Managed Schema:** Administrators can inject new profile fields (e.g., "LeetCode URL") in real-time without writing code.
- **Industry Templates:** Switch between Developer, Designer, and Student profile blueprints instantly to suit the candidate's career track.
- **NFT Integrity:** `updateProfileCID()` mechanism updates the underlying on-chain profile metadata (IPFS hash) while keeping the same static SBT.

### 🧠 AI Career Evolution Engine
- **Intelligent Job Matching:** Vector embeddings via LangChain score profiles against job descriptions instantly.
- **Career Path Simulator:** AI-driven roadmap predicting the candidate's next 3 professional milestones based on verified on-chain skill NFTs.
- **Skill Timeline:** A holographic, interactive visualization of the developer's growth from intern to senior engineer.

---

## 📁 Monorepo Structure

```text
Skillsutra/
├── web/                     # Next.js 14 Frontend (App Router, Tailwind, Shadcn UI)
├── server/                  # Python FastAPI AI Backend (LangChain, Pydantic)
├── programs/                # Rust Anchor Smart Contracts (Solana Web3 state handling)
├── database/                # Supabase PostgreSQL schema migrations
└── docker-compose.yml       # Production-ready orchestration
```

## 🚀 Quick Setup

1. **Deploy the Database**
   Import the dual-state database blueprint via `/database/migrations/001_init.sql` into Supabase.

2. **Boot the AI Backend**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Launch the Client App**
   ```bash
   cd web
   npm install
   npm run dev
   ```

4. **Deploy Smart Contracts (Localnet)**
   ```bash
   cd programs
   anchor build
   anchor deploy
   ```

---

<p align="center">
  Engineered with ❤️ for decentralized hiring.
</p>
