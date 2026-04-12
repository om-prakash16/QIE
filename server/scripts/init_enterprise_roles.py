from core.supabase import get_supabase
import uuid

def initialize_enterprise_roles():
    db = get_supabase()
    if not db:
        print("Supabase not configured.")
        return

    roles_to_add = [
        {"role_name": "SUPER_ADMIN", "description": "Full platform control and administrative override."},
        {"role_name": "AI_ADMIN", "description": "Manage AI scoring algorithms and configuration."},
        {"role_name": "MODERATOR", "description": "Manage user reports and content moderation."}
    ]

    for role in roles_to_add:
        # Check if exists
        existing = db.table("roles").select("*").eq("role_name", role["role_name"]).execute()
        if not existing.data:
            id = str(uuid.uuid4())
            db.table("roles").insert({"id": id, **role}).execute()
            print(f"Added role: {role['role_name']}")
        else:
            print(f"Role {role['role_name']} already exists.")

    # Optional: Backfill permissions if table exists
    # Sections 21 mention admin_users, profile_schema, etc.
    
    print("Base Enterprise Roles Initialized.")

if __name__ == "__main__":
    initialize_enterprise_roles()
