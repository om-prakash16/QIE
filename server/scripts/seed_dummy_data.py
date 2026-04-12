import uuid
import datetime
from core.supabase import get_supabase

def seed_data():
    db = get_supabase()
    if not db:
        print("[ERROR] Supabase client not initialized. Check .env")
        return

    print("--- Starting Data Seeding Protocol ---")

    # 1. Use Existing Admin User (to bypass RLS/trigger issues on user-settings)
    user_id = "30811af7-47ed-475d-9a77-497c6fd47d88" # Admin User
    print(f"[1/4] Using active Admin Node: {user_id}")

    # 2. Check/Assign COMPANY role
    print("[2/4] Verifying role permissions...")
    try:
        role_resp = db.table("roles").select("id").eq("role_name", "COMPANY").execute()
        if role_resp.data:
            role_id = role_resp.data[0]["id"]
            existing_role = db.table("user_roles").select("*").eq("user_id", user_id).eq("role_id", role_id).execute()
            if not existing_role.data:
                db.table("user_roles").insert({"user_id": user_id, "role_id": role_id}).execute()
                print("  + COMPANY role assigned.")
            else:
                print("  + Role already established.")
    except Exception as e:
        print(f"  [!] Role assignment skipped: {e}")

    # 3. Create Dummy Company
    company_name = "SkillProof AI - Demo Corp"
    print(f"[3/4] Synthesizing dummy company node: {company_name}")
    try:
        company_resp = db.table("companies").insert({
            "name": company_name,
            "created_by_user_id": user_id,
        }).execute()

        if not company_resp.data:
            print("[ERROR] Failed to create company (RLS Violation?)")
            return
        
        company_id = company_resp.data[0]["id"]
        print(f"  + Company established: {company_id}")

        # Add as owner in company_members
        db.table("company_members").insert({
            "company_id": company_id,
            "user_id": user_id,
            "company_role": "OWNER"
        }).execute()
    except Exception as e:
        print(f"[ERROR] Company synthesis failed: {e}")
        return

    # 4. Create 6 Dummy Jobs
    print(f"[4/4] Generating 6 dummy jobs for {company_name}...")
    
    jobs_data = [
        {
            "title": "Senior AI Resonance Architect",
            "description": "Lead the development of our core semantic matching engine. Optimize RAG pipelines and vector database resonance.",
            "skills_required": ["Python", "FastAPI", "OpenAI", "Vector DB", "PyTorch"],
            "experience_level": "Senior",
            "salary_range": "$160k - $220k",
            "job_type": "remote",
            "location": "Global",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat()
        },
        {
            "title": "Full-Stack Node Engineer (Identity Layer)",
            "description": "Build high-performance UIs using Next.js 14 and integrate them with our blockchain identity protocols.",
            "skills_required": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Solana"],
            "experience_level": "Mid-Senior",
            "salary_range": "$130k - $180k",
            "job_type": "hybrid",
            "location": "SF / Palo Alto",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat()
        },
        {
            "title": "Frontend Interface Designer",
            "description": "Craft premium, glassmorphic interfaces that wow our enterprise partners. Expert-level knowledge of Framer Motion is required.",
            "skills_required": ["React", "Framer Motion", "CSS3", "Design Systems"],
            "experience_level": "Senior",
            "salary_range": "$110k - $160k",
            "job_type": "remote",
            "location": "Global",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=10)).isoformat()
        },
        {
            "title": "Database Reliability Engineer",
            "description": "Ensure the high availability and integrity of our global hiring mesh. Focus on PostgreSQL and Supabase performance.",
            "skills_required": ["PostgreSQL", "Supabase", "Redis", "Infrastructure as Code"],
            "experience_level": "Expert",
            "salary_range": "$150k - $200k",
            "job_type": "onsite",
            "location": "Houston, TX",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=15)).isoformat()
        },
        {
            "title": "Junior Python Developer (Automation)",
            "description": "Develop and maintain background tasks and notification triggers for the SkillProof ecosystem.",
            "skills_required": ["Python", "SQL", "Unit Testing", "REST APIs"],
            "experience_level": "Junior",
            "salary_range": "$70k - $100k",
            "job_type": "remote",
            "location": "London, UK",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=22)).isoformat()
        },
        {
            "title": "Blockchain Protocol Lead",
            "description": "Design and implement soulbound NFT minting logic and on-chain resume verification smart contracts.",
            "skills_required": ["Rust", "Solana", "Web3.js", "Cryptography"],
            "experience_level": "Senior",
            "salary_range": "$180k - $250k",
            "job_type": "hybrid",
            "location": "Berlin, DE",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=30)).isoformat()
        }
    ]

    for job in jobs_data:
        db.table("jobs").insert({
            "company_id": company_id,
            **job,
            "is_active": True
        }).execute()
        print(f"  + Added Job: {job['title']}")

    print("\n--- Seeding Complete! ---")
    print(f"Company ID: {company_id}")
    print(f"Owner Wallet: {dummy_wallet}")

if __name__ == "__main__":
    seed_data()
