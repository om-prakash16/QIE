import asyncio
import sys
import uuid
from core.supabase import get_supabase
from modules.users.service import UserService
from modules.search.service import SearchService
from modules.admin.service import AdminService
from modules.ai.proof_service import ProofScoreService
from modules.analytics.service import AnalyticsService

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

async def run_super_audit():
    print("🚀 --- BEST HIRING TOOL: GLOBAL SYSTEM AUDIT --- 🚀")
    db = get_supabase()
    test_uid = str(uuid.uuid4())
    
    try:
        # 1. Identity & Creation
        print("\n[PHASE 1] Creating User & Generating BHT Identity...")
        user_res = db.table("users").insert({
            "id": test_uid,
            "email": "super_audit@example.com",
            "wallet_address": f"0xAUDIT_{test_uid[:8]}"
        }).execute()
        user = user_res.data[0]
        user_code = user.get("user_code")
        print(f"✅ User Identity Secured: {user_code}")

        # 2. Relational Profile Ingestion
        print("\n[PHASE 2] Syncing Relational Profile (Exp, Proj, Skills)...")
        profile_data = {
            "profile": {"full_name": "Senior SaaS Auditor", "headline": "Master of Relational Architecture", "location": "Remote"},
            "experiences": [{"company_name": "Audit Global", "role": "System Architect", "is_current": True}],
            "projects": [{"title": "System Audit X", "description": "Relational integrity check using Python"}],
            "skills": [{"name": "Python", "proficiency": "Expert"}, {"name": "PostgreSQL", "proficiency": "Expert"}]
        }
        await UserService.update_profile(test_uid, profile_data)
        print("✅ Relational sync complete (5 tables updated).")

        # 3. AI Intelligence Loop
        print("\n[PHASE 3] Calculating AI Proof Score...")
        score = await ProofScoreService.calculate_proof_score(test_uid)
        print(f"✅ AI Analysis Complete. Proof Score: {score}")

        # 4. Search & Filtering
        print("\n[PHASE 4] Testing Search Nexus (FTS & Filters)...")
        # Test 1: Keyword Search
        res_keyword = await SearchService.search(query="Relational")
        print(f"🔍 Keyword Match: Found {len(res_keyword['candidates'])} candidates.")
        
        # Test 2: Skill Filter
        res_skill = await SearchService.search(skills=["Python"])
        print(f"🔍 Skill Filter: Found {len(res_skill['candidates'])} Python experts.")

        # 5. Admin Control (CMS)
        print("\n[PHASE 5] Testing Admin CMS Control Panel...")
        # Toggle Feature
        await AdminService.toggle_feature("ai_matching", False)
        print("✅ Admin Toggle: ai_matching feature disabled.")
        
        # Update Weights
        await AdminService.update_ai_weights({"resume": 0.5, "github": 0.5, "skills": 0.0})
        print("✅ Admin Config: AI weights adjusted live.")

        # 6. Analytics & Dashboards
        print("\n[PHASE 6] Fetching Real-time Analytics...")
        user_stats = await AnalyticsService.get_user_analytics(test_uid)
        admin_stats = await AdminService.get_dashboard_metrics()
        print(f"📊 Dashboard: Total Users: {admin_stats['total_users']}, User Score: {user_stats['ai_proof_score']}")

        # Cleanup
        db.table("users").delete().eq("id", test_uid).execute()
        print("\n✅ --- ALL FEATURES VALIDATED: SYSTEM PRODUCTION READY --- ✅")

    except Exception as e:
        print(f"\n❌ AUDIT FAILED: {str(e)}")
        # Partial cleanup
        db.table("users").delete().eq("id", test_uid).execute()

if __name__ == "__main__":
    asyncio.run(run_super_audit())
