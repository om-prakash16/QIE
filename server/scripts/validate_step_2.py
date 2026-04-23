import asyncio
import sys
from core.supabase import get_supabase

# Set stdout to use utf-8 to avoid encoding issues on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

async def validate_database_and_identity():
    print("--- VALIDATING STEP 2 & 3 ---")
    db = get_supabase()
    if not db:
        print("[FAIL] Supabase connection failed")
        return

    # 1. Test Insert (Checking if trigger works)
    test_user_data = {
        "email": "test_identity@example.com",
        "wallet_address": "0xID_TEST_123"
    }
    
    print("Inserting test user (trigger should generate user_code)...")
    try:
        res = db.table("users").insert(test_user_data).execute()
        user = res.data[0]
        user_id = user["id"]
        generated_code = user.get("user_code")
        
        print(f"[OK] User created with ID: {user_id}")
        if generated_code and generated_code.startswith("BHT-"):
            print(f"[OK] Auto-generated code: {generated_code}")
        else:
            print(f"[WARNING] User code not auto-generated (or trigger not active). Found: {generated_code}")
        
        # 2. Test Profile Insert
        profile_data = {
            "user_id": user_id,
            "full_name": "Step Auditor",
            "headline": "Senior Backend Architect",
            "bio": "Validating relational integrity."
        }
        db.table("profiles").insert(profile_data).execute()
        print("[OK] Profile created and linked to user")

        # 3. Test Fetch by user_code
        if generated_code:
            print(f"Testing lookup by code: {generated_code}...")
            user_res = db.table("users").select("*").eq("user_code", generated_code).single().execute()
            if user_res.data:
                print(f"[OK] Identity system validated for {generated_code}")
            else:
                print(f"[FAIL] Could not find user by generated code")

        # Cleanup
        db.table("users").delete().eq("id", user_id).execute()
        print("[OK] Cleanup complete")
        
    except Exception as e:
        print(f"[FAIL] Validation failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(validate_database_and_identity())
