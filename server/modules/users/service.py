from pydantic import create_model
from typing import Dict, Any, List, Optional, Type
from core.supabase import get_supabase


class DynamicValidationService:
    @staticmethod
    async def get_active_schema() -> List[Dict[str, Any]]:
        """Fetch the current profile schema from the database."""
        db = get_supabase()
        if not db:
            # Fallback mock schema for local development
            return [
                {"field_name": "full_name", "field_type": "text", "required": True},
                {
                    "field_name": "years_of_experience",
                    "field_type": "number",
                    "required": True,
                },
            ]

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
    @staticmethod
    async def get_full_profile(user_id: str) -> Dict[str, Any]:
        """
        Fetches the complete normalized profile using multiple queries (Supabase pattern).
        """
        db = get_supabase()
        if not db: return {}

        import asyncio

        # Run multiple queries in parallel for performance
        tasks = [
            db.table("users").select("*, profiles(*)").eq("id", user_id).single().execute(),
            db.table("user_skills_relational").select("*, skills(name, category)").eq("user_id", user_id).execute(),
            db.table("experiences").select("*").eq("user_id", user_id).order("start_date", desc=True).execute(),
            db.table("projects").select("*").eq("user_id", user_id).order("start_date", desc=True).execute(),
            db.table("education").select("*").eq("user_id", user_id).order("start_date", desc=True).execute(),
            db.table("ai_scores").select("*").eq("user_id", user_id).single().execute()
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        user_res = results[0].data if not isinstance(results[0], Exception) else {}
        skills_res = results[1].data if not isinstance(results[1], Exception) else []
        exp_res = results[2].data if not isinstance(results[2], Exception) else []
        proj_res = results[3].data if not isinstance(results[3], Exception) else []
        edu_res = results[4].data if not isinstance(results[4], Exception) else []
        scores_res = results[5].data if not isinstance(results[5], Exception) else {}

        # Aggregate into a structured response
        return {
            "profile": {
                "user_id": user_id,
                "user_code": user_res.get("user_code"),
                "username": user_res.get("username"),
                "visibility": user_res.get("visibility"),
                **(user_res.get("profiles", {}) or {})
            },
            "skills": [
                {"name": s["skills"]["name"], "category": s["skills"]["category"], "proficiency": s["proficiency_level"], "verified": s["is_verified"]}
                for s in skills_res if s.get("skills")
            ],
            "experiences": exp_res,
            "projects": proj_res,
            "education": edu_res,
            "ai_scores": scores_res
        }

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

        return {"status": "success"}

    @staticmethod
    async def get_portfolio_by_code(user_code: str) -> Optional[Dict[str, Any]]:
        """
        Public portfolio resolver by user_code.
        """
        db = get_supabase()
        user_res = db.table("users").select("id, visibility").eq("user_code", user_code).single().execute()
        if not user_res.data:
            return None
        
        user = user_res.data
        if user["visibility"] == "private":
            return None # Hidden
            
        return await UserService.get_full_profile(user["id"])
