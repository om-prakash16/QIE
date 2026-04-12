
from core.supabase import get_supabase
import asyncio

async def check_user():
    db = get_supabase()
    if not db:
        print("Database unavailable")
        return

    # Check users table
    res = db.table("users").select("*").eq("email", "opks47284@gmail.com").execute()
    print("Users found:", res.data)

    if res.data:
        user_id = res.data[0]["id"]
        # Check roles
        roles_res = db.table("user_roles").select("roles(role_name)").eq("user_id", user_id).execute()
        print("Roles found:", roles_res.data)

if __name__ == "__main__":
    asyncio.run(check_user())
