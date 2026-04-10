# Best Hiring Tool: Scalable SaaS Architecture

Best Hiring Tool is architected as a high-performance, modular monorepo that bridges the gap between traditional SaaS (Supabase/FastAPI) and Web3 (Solana/IPFS).

## 🏛️ Project Structure

### `web/` (Next.js 14 Frontend)
The frontend core, utilizing Next.js App Router for domain-driven navigation.
- **`app/`**: Route-based pages for Candidates, Companies, and Admins.
- **`components/ui/`**: Premium shadcn/ui visual elements with 100% Elite Gateway styling.
- **`components/forms/`**: Dynamic AI-driven form generation.
- **`lib/api/`**: Strongly typed FastAPI client integration.

### `server/` (FastAPI Backend)
A modular Python backend designed for independent service scaling.
- **`modules/ai/`**: Orchestrates Gemini 1.5 resonance scoring and resume analysis.
- **`modules/nft/`**: Manages on-chain identity minting and Metaplex metadata.
- **`modules/sync/`**: High-assurance state synchronization between Supabase, IPFS, and Solana.
- **`modules/analytics/`**: Aggregates platform-wide career growth and hiring metrics.
- **`core/database/`**: Optimized Supabase PostgreSQL connection layer with RLS enforcement.

### `contracts/` (Solana Anchor Programs)
Verifiable professional state on-chain.
- **`programs/this-best-hiring-tool/`**: Core Anchor program for credential issuance.
- **`instructions/`**: Atomic instructions for minting and metadata updates.

---

## 🚀 Key Architectural Benefits
1. **Modular Consistency**: Each backend domain is isolated, allowing AI logic to grow without impacting Auth or Marketplace features.
2. **Web3 State Sync**: A dedicated sync module ensures 100% data parity between off-chain SaaS state and on-chain verifiable records.
3. **Enterprise Scalability**: Dockerized environment paths allow for seamless deployment to Vercel (Frontend), Render (API), and Colosseum (AI Research).

## 🛠️ Security Infrastructure
- **Role-Based Access Control (RBAC)**: Enforced at both the FastAPI router level and Supabase RLS level.
- **Audit Logging**: Every administrative toggle and on-chain sync is logged to `staff_action_logs` for transparency.
