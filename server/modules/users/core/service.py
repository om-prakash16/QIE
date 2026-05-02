from pydantic import create_model
from typing import Dict, Any, List, Optional, Type
from core.supabase import get_supabase
import asyncio
from cachetools import TTLCache
from datetime import datetime


class DynamicValidationService:
    @staticmethod
    async def get_active_schema() -> List[Dict[str, Any]]:
        """Fetch the current profile schema from the database."""
        db = get_supabase()
        if not db:
            raise Exception("Database connection unavailable for schema fetch")

        response = (
            db.table("profile_schema")
            .select("*")
            .eq("is_active", True)
            .order("display_order")
            .execute()
        )
        return response.data

    @classmethod
    async def create_pydantic_model(cls) -> Type[Any]:
        """
        Generates a runtime Pydantic model based on the active dynamic schema.
        """
        fields = await cls.get_active_schema()
        field_definitions = {}

        for field in fields:
            name = field["field_name"]
            f_type = field["field_type"]
            required = field.get("required", False)

            # Map database field types to Python types
            python_type = str
            if f_type == "number":
                python_type = float
            elif f_type in ["multi-select", "select"] and "options" in field.get(
                "validation_rules", {}
            ):
                # For multi-select, it would be List[str]
                python_type = List[str] if f_type == "multi-select" else str
            elif f_type == "checkbox":
                python_type = bool

            # Create field definition with validation
            if required:
                field_definitions[name] = (python_type, ...)
            else:
                field_definitions[name] = (Optional[python_type], None)

        return create_model("DynamicProfileModel", **field_definitions)

    @staticmethod
    def generate_metaplex_attributes(
        profile_data: Dict[str, Any],
    ) -> List[Dict[str, str]]:
        """
        Maps a dynamic profile JSON to Metaplex standard attributes for NFTs.
        """
        attributes = []
        for key, value in profile_data.items():
            if value is None:
                continue

            # Format the label by replacing underscores with spaces and capitalizing
            label = key.replace("_", " ").title()

            # Convert values to strings for on-chain compatibility
            str_value = (
                str(value)
                if not isinstance(value, list)
                else ", ".join(map(str, value))
            )

            attributes.append({"trait_type": label, "value": str_value})

        return attributes
class UserService:
    # Cache for 2 minutes (120 seconds) with max 1000 items
    _PROFILE_CACHE = TTLCache(maxsize=1000, ttl=120)

    @staticmethod
    async def get_full_profile(user_id: str) -> Dict[str, Any]:
        """
        Fetches the complete normalized profile using parallel queries and TTL caching.
        """
        if user_id in UserService._PROFILE_CACHE:
            return UserService._PROFILE_CACHE[user_id]

        db = get_supabase()
        if not db: return {}

        # Define wrapper functions for asyncio.to_thread
        def run_q(table, select="*", order_by=None, desc=True, single=False):
            q = db.table(table).select(select).eq("user_id", user_id)
            if order_by:
                q = q.order(order_by, desc=desc)
            return q.single().execute() if single else q.execute()

        # Users table query is slightly different as it uses 'id' instead of 'user_id'
        def run_user_q():
            return db.table("users").select("*, profiles(*)").eq("id", user_id).execute()

        try:
            # Execute all queries in parallel via threads (since client is sync)
            res_user, res_skills, res_exp, res_proj, res_edu, res_scores = await asyncio.gather(
                asyncio.to_thread(run_user_q),
                asyncio.to_thread(run_q, "user_skills_relational", "*, skills(name, category)"),
                asyncio.to_thread(run_q, "experiences", "*", "start_date"),
                asyncio.to_thread(run_q, "projects", "*", "start_date"),
                asyncio.to_thread(run_q, "education", "*", "start_date"),
                asyncio.to_thread(run_q, "ai_scores", "*")
            )
        except Exception as e:
            print(f"Parallel fetch error: {e}")
            # Fallback to sequential or return empty if fatal
            return {}
        
        user_data = res_user.data[0] if res_user.data else {}
        skills_data = res_skills.data if res_skills.data else []
        exp_data = res_exp.data if res_exp.data else []
        proj_data = res_proj.data if res_proj.data else []
        edu_data = res_edu.data if res_edu.data else []
        scores_data = res_scores.data[0] if res_scores.data else {}

        # Aggregate into a structured response
        profiles_raw = user_data.get("profiles", {})
        profiles_cleaned = profiles_raw[0] if isinstance(profiles_raw, list) and profiles_raw else (profiles_raw or {})
        
        result = {
            "profile": {
                "user_id": user_id,
                "user_code": user_data.get("user_code"),
                "username": user_data.get("username"),
                "visibility": user_data.get("visibility"),
                **profiles_cleaned
            },
            "skills": [
                {"name": s["skills"]["name"], "category": s["skills"]["category"], "proficiency": s["proficiency_level"], "verified": s["is_verified"]}
                for s in skills_data if s.get("skills")
            ],
            "experiences": exp_data,
            "projects": proj_data,
            "education": edu_data,
            "ai_scores": scores_data
        }

        # Update Cache
        UserService._PROFILE_CACHE[user_id] = result
        return result

    @staticmethod
    async def update_profile(user_id: str, data: Dict[str, Any]):
        """
        Professional relational update flow with batch processing and dictionary linking.
        """
        db = get_supabase()
        if not db: return {"status": "error", "message": "Database connection failed"}

        # 1. Update Core Profile & User Metadata
        if "profile" in data:
            p = data["profile"]
            db.table("profiles").upsert({
                "user_id": user_id,
                "full_name": p.get("full_name", "Anonymous"),
                "headline": p.get("headline"),
                "bio": p.get("bio"),
                "location": p.get("location")
            }).execute()
            
            u_meta = {}
            if "visibility" in p: u_meta["visibility"] = p["visibility"]
            if "username" in p: u_meta["username"] = p["username"]
            if u_meta:
                db.table("users").update(u_meta).eq("id", user_id).execute()

        # 2. Batch Update Experiences
        if "experiences" in data:
            db.table("experiences").delete().eq("user_id", user_id).execute()
            exps = [{**exp, "user_id": user_id} for exp in data["experiences"]]
            if exps: db.table("experiences").insert(exps).execute()

        # 3. Batch Update Projects
        if "projects" in data:
            db.table("projects").delete().eq("user_id", user_id).execute()
            projs = [{**proj, "user_id": user_id} for proj in data["projects"]]
            if projs: db.table("projects").insert(projs).execute()

        # 4. Batch Update Education
        if "education" in data:
            db.table("education").delete().eq("user_id", user_id).execute()
            edus = [{**edu, "user_id": user_id} for edu in data["education"]]
            if edus: db.table("education").insert(edus).execute()

        # 5. Professional Skill Linking (Dictionary Pattern)
        if "skills" in data:
            # skills format expected: [{"name": "Python", "proficiency": "Expert"}]
            db.table("user_skills_relational").delete().eq("user_id", user_id).execute()
            
            for s_item in data["skills"]:
                s_name = s_item["name"]
                # Find or Create Skill in Dictionary
                skill_res = db.table("skills").select("id").eq("name", s_name).execute()
                if not skill_res.data:
                    skill_res = db.table("skills").insert({"name": s_name, "category": s_item.get("category")}).execute()
                
                skill_id = skill_res.data[0]["id"]
                # Link User to Skill
                db.table("user_skills_relational").insert({
                    "user_id": user_id,
                    "skill_id": skill_id,
                    "proficiency_level": s_item.get("proficiency", "Intermediate")
                }).execute()

        # Invalidate Cache after update
        if user_id in UserService._PROFILE_CACHE:
            del UserService._PROFILE_CACHE[user_id]

        return {"status": "success"}

    @staticmethod
    async def get_portfolio_by_code(user_code: str) -> Optional[Dict[str, Any]]:
        """
        Public portfolio resolver by user_code.
        """
        db = get_supabase()
        user_res = db.table("users").select("id, visibility").eq("user_code", user_code).execute()
        if not user_res.data:
            return None
        
        user = user_res.data[0]
        if user["visibility"] == "private":
            return None # Hidden
            
        return await UserService.get_full_profile(user["id"])
