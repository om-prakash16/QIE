import secrets
import hashlib
from typing import Dict, Any, Optional, List
from core.supabase import get_supabase


class EnterpriseApiService:
    """
    Enterprise API Key Management and Validation.
    Handles secure key generation and hashing.
    """

    def generate_api_key(
        self,
        company_id: str,
        label: str,
        scopes: List[str] = ["read.proof_score", "read.skills"],
    ) -> str:
        """
        Generate a new 32-character random API key.
        Saves the SHA-256 hash and returns the raw key.
        """
        raw_key = f"sk_{secrets.token_urlsafe(32)}"
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

        db = get_supabase()
        if db:
            db.table("enterprise_api_keys").insert(
                {
                    "company_id": company_id,
                    "api_key_hash": key_hash,
                    "label": label,
                    "scopes": scopes,
                }
            ).execute()

        return raw_key

    async def validate_api_key(self, api_key: str) -> Optional[Dict[str, Any]]:
        """
        Validate an incoming API key against hashed records.
        Returns the company context and scopes if valid.
        """
        if not api_key:
            return None

        key_hash = hashlib.sha256(api_key.encode()).hexdigest()

        db = get_supabase()
        if not db:
            return None

        resp = (
            db.table("enterprise_api_keys")
            .select("company_id, scopes, is_active")
            .eq("api_key_hash", key_hash)
            .eq("is_active", True)
            .single()
            .execute()
        )

        if resp.data:
            # Update last used timestamp (fire and forget)
            db.table("enterprise_api_keys").update({"last_used_at": "now()"}).eq(
                "api_key_hash", key_hash
            ).execute()
            return resp.data

        return None

    def list_api_keys(self, company_id: str) -> List[Dict[str, Any]]:
        """
        List all API keys for a specific company.
        """
        db = get_supabase()
        if not db:
            return []

        resp = (
            db.table("enterprise_api_keys")
            .select("id, label, api_key_hash, scopes, is_active, last_used_at, created_at")
            .eq("company_id", company_id)
            .order("created_at", desc=True)
            .execute()
        )

        return resp.data or []

    def revoke_api_key(self, key_id: str):
        """
        Deactivate an API key.
        """
        db = get_supabase()
        if db:
            db.table("enterprise_api_keys").update({"is_active": False}).eq(
                "id", key_id
            ).execute()
