
import os
from supabase import create_client, Client

url = "https://puprmtfdjsuiqlvtqfrh.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cHJtdGZkanN1aXFsdnRxZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzYwNTQsImV4cCI6MjA5MDM1MjA1NH0.53vsuQ3DXw-frHhf8z1TBROcg1aMBkVd6vzgWr1ZpHM"

supabase: Client = create_client(url, key)

def fix_branding():
    # Try site_content
    try:
        res = supabase.table("site_content").select("*").execute()
        items = res.data
        updates = 0
        for item in items:
            val = item.get("content_value") or ""
            new_val = val
            
            # Replace branding
            if "SkillProof" in new_val:
                new_val = new_val.replace("SkillProof", "Best Hiring Tool")
            if "Skillsutra" in new_val:
                new_val = new_val.replace("Skillsutra", "Best Hiring Tool")
            if "THE SKILLPROOF PARADIGM" in new_val:
                new_val = new_val.replace("THE SKILLPROOF PARADIGM", "THE BEST HIRING PARADIGM")
                
            if new_val != val:
                print(f"Updating site_content: {item.get('section_key')}.{item.get('content_key')}")
                supabase.table("site_content").update({"content_value": new_val}).eq("id", item["id"]).execute()
                updates += 1
        print(f"Branding Fix Complete for site_content. Updated {updates} items.")
    except Exception as e:
        print(f"Error updating site_content: {e}")

if __name__ == "__main__":
    fix_branding()
