from pydantic import create_model, validator, Field
from typing import Dict, Any, List, Optional, Type
from core.supabase import get_supabase
import json

class DynamicValidationService:
    @staticmethod
    async def get_active_schema() -> List[Dict[str, Any]]:
        """Fetch the current profile schema from the database."""
        db = get_supabase()
        if not db:
            # Fallback mock schema for local development
            return [
                {"field_name": "full_name", "field_type": "text", "required": True},
                {"field_name": "years_of_experience", "field_type": "number", "required": True}
            ]
        
        response = db.table("profile_schema").select("*").eq("is_active", True).order("display_order").execute()
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
            elif f_type in ["multi-select", "select"] and "options" in field.get("validation_rules", {}):
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
    def generate_metaplex_attributes(profile_data: Dict[str, Any]) -> List[Dict[str, str]]:
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
            str_value = str(value) if not isinstance(value, list) else ", ".join(map(str, value))
            
            attributes.append({
                "trait_type": label,
                "value": str_value
            })
        
        return attributes
