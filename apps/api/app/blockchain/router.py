from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.blockchain.service import NFTService
from app.auth.service import get_current_user
from core.supabase import get_supabase

router = APIRouter()
nft_service = NFTService()

# --- Models ---
class MintProfileRequest(BaseModel):
    wallet_address: str
    attributes: List[Dict[str, Any]]

class MintSkillRequest(BaseModel):
    wallet_address: str
    skill_name: str
    score: int
    level: str

class UpdateMetadataRequest(BaseModel):
    wallet_address: str
    mint_address: str
    attributes: List[Dict[str, Any]]

# --- API Endpoints ---

@router.post("/mint-profile")
async def mint_profile(data: MintProfileRequest):
    """
    Generates profile metadata, pins to IPFS, and returns CID for Solana minting.
    """
    db = get_supabase()
    user_data = {}
    if db:
        user_resp = db.table("users").select("*").eq("wallet_address", data.wallet_address).single().execute()
        user_data = user_resp.data if user_resp.data else {}

    metadata = nft_service.generate_profile_metadata(user_data, data.attributes)
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "mint_authority": os.getenv("SOLANA_ADMIN_WALLET"),
        "metadata": metadata,
        "new_cid": cid,
        "message": "Metadata ready for Solana minting. Frontend should now trigger the Anchor transaction."
    }

@router.post("/mint-skill")
async def mint_skill(data: MintSkillRequest):
    """
    Generates skill metadata and CID after AI verification.
    """
    metadata = nft_service.generate_skill_metadata(data.skill_name, data.score, data.level)
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "metadata": metadata,
        "new_cid": cid,
        "message": "Skill certificate ready for on-chain issuance."
    }

@router.post("/update-metadata")
async def update_metadata(data: UpdateMetadataRequest):
    """
    Generates updated metadata for an existing NFT.
    """
    db = get_supabase()
    user_data = {}
    if db:
        user_resp = db.table("users").select("*").eq("wallet_address", data.wallet_address).single().execute()
        user_data = user_resp.data if user_resp.data else {}

    metadata = nft_service.generate_profile_metadata(user_data, data.attributes)
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "mint_address": data.mint_address,
        "new_cid": cid,
        "metadata": metadata
    }

@router.get("/user-nfts")
async def get_user_nfts(wallet: str):
    """
    Fetches user NFTs from the database/indexer.
    """
    db = get_supabase()
    if not db:
        return [
            {"mint": "mint123", "type": "profile", "cid": "QmProfileCID"},
            {"mint": "cert456", "type": "skill", "cid": "QmSkillCID"}
        ]
    
    response = db.table("nft_records").select("*").eq("owner_wallet", wallet).execute()
    return response.data

@router.post("/register")
async def register_nft(wallet: str, mint: str, nft_type: str, cid: str):
    """
    Callback for frontend to register a successful on-chain transaction.
    """
    await nft_service.register_nft(wallet, mint, nft_type, cid)
    return {"status": "registered"}
