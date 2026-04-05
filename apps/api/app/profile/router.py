"""
User Panel API Routes.
Handles profile CRUD, IPFS sync, privacy controls, and profile snapshots.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from core.supabase import get_supabase
from datetime import datetime
import hashlib
import json

from app.auth.service import get_current_user, get_user_permissions
from app.profile.service import DynamicValidationService

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    wallet_address: str
    profile_data: Dict[str, Any]

class PrivacySettings(BaseModel):
    profile_visibility: str = "public"  # public | private | recruiter_only
    wallet_address_visible: bool = False
    reputation_score_visible: bool = True
    nft_credentials_visible: bool = True
    fields: Dict[str, str] = {}  # field_key -> "public" | "private" | "recruiter_only"

class SyncNFTRequest(BaseModel):
    wallet_address: str
    tx_signature: str
    new_cid: str

@router.get("/auth/me")
async def get_my_auth_details(user = Depends(get_current_user)):
    """Fetch current user identity, role, and permissions."""
    user_id = getattr(user, "id", None) or user.get("id")
    permissions = await get_user_permissions(user_id)
    
    # Try to get role name
    db = get_supabase()
    role_name = "USER" # Default
    if db:
        role_resp = db.table("user_roles") \
            .select("roles(role_name)") \
            .eq("user_id", user_id) \
            .single().execute()
        if role_resp.data:
            role_name = role_resp.data.get("roles", {}).get("role_name", "USER")

    return {
        "id": user_id,
        "email": getattr(user, "email", None),
        "role": role_name,
        "permissions": permissions
    }

# ─── Profile Endpoints ───────────────────────────────────────────────

@router.get("/profile")
async def get_user_profile(wallet: str = "", user_id: str = ""):
    """Fetch user profile by wallet address or user ID."""
    db = get_supabase()
    if not db:
        return {
            "wallet_address": wallet or "demo_wallet",
            "full_name": "Demo User",
            "bio": "Full-stack Solana developer with 5 years of experience.",
            "reputation_score": 742,
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
            "location": "Remote",
            "skills": ["Rust", "Solana", "TypeScript", "Next.js", "Python"],
            "current_ipfs_cid": "QmMockCID123",
            "dynamic_fields": {
                "github_handle": "demodev",
                "leetcode_url": "https://leetcode.com/demo",
                "hackathon_participation": "ETHIndia 2024 Winner"
            },
            "privacy_settings": {
                "profile_visibility": "public",
                "wallet_address_visible": False,
                "reputation_score_visible": True,
                "nft_credentials_visible": True,
                "fields": {}
            }
        }

    query = db.table("users").select("*")
    if wallet:
        query = query.eq("wallet_address", wallet)
    elif user_id:
        query = query.eq("id", user_id)
    else:
        raise HTTPException(status_code=400, detail="Provide wallet or user_id")

    response = query.single().execute()
    return response.data


@router.post("/profile/update")
async def update_profile(data: ProfileUpdate):
    """Save profile data and generate IPFS metadata CID."""
    db = get_supabase()
    
    # 1. Dynamic Validation
    try:
        DynamicModel = await DynamicValidationService.create_pydantic_model()
        # validate data against schema
        validated_data = DynamicModel(**data.profile_data).model_dump()
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Validation failed: {str(e)}")

    # 2. Metaplex Attribute Mapping
    attributes = DynamicValidationService.generate_metaplex_attributes(validated_data)
    
    # Construct NFT metadata
    metadata = {
        "name": "SkillProof AI Profile",
        "description": "AI-Verified Professional Profile",
        "attributes": attributes,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # 3. IPFS Snapshot (Mock CID for demo)
    metadata_json = json.dumps(metadata, sort_keys=True)
    mock_cid = "Qm" + hashlib.sha256(metadata_json.encode()).hexdigest()[:44]

    if not db:
        return {
            "status": "success",
            "new_cid": mock_cid,
            "version": 1,
            "ready_to_sync": True,
            "message": "Profile updated (mock mode)"
        }

    # 4. Update dynamic profile data
    db.table("users").update({
        "dynamic_profile_data": validated_data,
        "current_ipfs_cid": mock_cid
    }).eq("wallet_address", data.wallet_address).execute()

    # 5. Version History
    version_count = db.table("profile_versions").select("id", count="exact") \
        .eq("wallet_address", data.wallet_address).execute()
    
    version = (version_count.count + 1) if version_count.count is not None else 1

    # Create Snapshot entry
    db.table("profile_versions").insert({
        "wallet_address": data.wallet_address,
        "ipfs_cid": mock_cid,
        "metadata_snapshot": metadata
    }).execute()

    return {
        "status": "success",
        "new_cid": mock_cid,
        "version": version,
        "ready_to_sync": True
    }


@router.post("/profile/sync-nft")
async def sync_nft(data: SyncNFTRequest):
    """Confirm on-chain sync after Solana transaction."""
    db = get_supabase()
    if not db:
        return {
            "status": "synced",
            "on_chain_tx": data.tx_signature,
            "message": "NFT metadata updated (mock mode)"
        }

    # Mark the CID as confirmed on chain (can be used for rollback auditing)
    return {"status": "synced", "on_chain_tx": data.tx_signature}


@router.get("/profile/snapshots")
async def get_profile_snapshots(wallet: str):
    """Get version history of profile metadata."""
    db = get_supabase()
    if not db:
        return [
            {"ipfs_cid": "QmABC123", "created_at": "2026-04-03T10:00:00"},
            {"ipfs_cid": "QmDEF456", "created_at": "2026-04-01T08:30:00"},
            {"ipfs_cid": "QmGHI789", "created_at": "2026-03-28T14:15:00"},
        ]

    response = db.table("profile_versions").select("*") \
        .eq("wallet_address", wallet) \
        .order("created_at", desc=True).execute()
    return response.data


@router.patch("/profile/privacy")
async def update_privacy(wallet: str, settings: PrivacySettings):
    """Update user privacy settings."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "settings": settings.model_dump()}

    db.table("users").update({
        "privacy_settings": settings.model_dump()
    }).eq("wallet_address", wallet).execute()

    return {"status": "success", "settings": settings.model_dump()}


@router.get("/profile/privacy")
async def get_privacy(wallet: str):
    """Get user privacy settings."""
    db = get_supabase()
    if not db:
        return {
            "profile_visibility": "public",
            "wallet_address_visible": False,
            "reputation_score_visible": True,
            "nft_credentials_visible": True,
            "fields": {}
        }

    response = db.table("users").select("privacy_settings") \
        .eq("wallet_address", wallet).single().execute()
    return response.data.get("privacy_settings", {})
