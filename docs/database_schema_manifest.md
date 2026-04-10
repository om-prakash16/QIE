# Best Hiring Tool: Database Schema Manifest & Relationships

This document outlines the **Master Relational Architecture** of the Best Hiring Tool platform. The schema is designed for high-assurance, multi-tenant SaaS operations while maintaining a verifiable link to the Solana blockchain.

## 🏛️ Core Entity Relationships

### 1. Identity & Reputation Hub
*   **`users` ➔ `user_roles`**: Implements Role-Based Access Control (RBAC). A user can have many roles (USER, COMPANY, ADMIN).
*   **`users` ➔ `dynamic_profile_data`**: Stores sovereign professional identity in a schema-driven JSONB structure.
*   **`users` ➔ `ai_scores`**: Persistence layer for the high-fidelity resonance scores (Skill, Project, Experience).

### 2. Multi-Tenant Workspace
*   **`companies` ➔ `company_members`**: Defines the boundary for hiring organizations. Members are linked from the `users` table.
*   **`companies` ➔ `jobs`**: A 1:N relationship where companies own their marketplace listings.
*   **`jobs` ➔ `applications`**: Connects candidates to opportunities. Includes an `ai_match_score` for recruiter prioritization.

### 3. Web3 & Verification State
*   **`users` ➔ `nft_records`**: Tracks which skill certificates or profile NFTs are currently active on the Solana blockchain.
*   **`users` ➔ `metadata_versions`**: Maintains a historical trail of IPFS CIDs for verifiable identity playback.
*   **`sync_status`**: Monitors the consistency of the "Dual-State" architecture (Supabase vs. IPFS).

---

## 📊 System Infrastructure
- **`feature_flags`**: Administrative control for real-time capability toggling.
- **`notifications` & `activity_logs`**: High-fidelity audit trail for platform transparency.
- **`analytics_events`**: Aggregated metric stream for system-wide growth reporting.

## 🛠️ Security & Isolation (RLS)
- **Multi-Tenancy**: Data isolation is enforced at the PostgreSQL Row-Level Security (RLS) level. Companies can only see applications for their own jobs.
- **Privacy**: User profile data in `dynamic_profile_data` is only readable via explicit permission or based on `is_active` status in the `jobs` marketplace context.
