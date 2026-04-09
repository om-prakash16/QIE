from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from modules.nft.service import NFTService
from modules.auth.service import get_current_user
from core.supabase import get_supabase
import os

router = APIRouter()
nft_service = NFTService()

# Models
class MintProfileRequest(BaseModel):
    user_id: str
    attributes: List[Dict[str, Any]]

class MintSkillRequest(BaseModel):
    user_id: str
    skill_name: str

class UpdateMetadataRequest(BaseModel):
    user_id: str
    mint_address: str
    attributes: List[Dict[str, Any]]

# API Endpoints

@router.post("/mint-profile")
async def mint_profile(data: MintProfileRequest):
    """
    Generate profile metadata and pin to IPFS.
    """
    metadata = await nft_service.generate_profile_metadata(data.user_id, data.attributes)
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "mint_authority": os.getenv("SOLANA_ADMIN_WALLET"),
        "metadata": metadata,
        "cid": cid,
        "message": "Profile metadata ready for Solana minting."
    }

@router.post("/mint-skill")
async def mint_skill(data: MintSkillRequest):
    """
    Verify skill and generate certificate metadata.
    """
    verification = await nft_service.check_skill_verification(data.user_id, data.skill_name)
    if not verification:
        raise HTTPException(status_code=400, detail="Skill verification failed. Take the AI quiz first.")
        
    metadata = await nft_service.generate_skill_metadata(
        data.user_id, 
        data.skill_name, 
        verification["score"], 
        verification["level"]
    )
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "metadata": metadata,
        "cid": cid,
        "message": "Skill certificate ready for on-chain issuance."
    }

@router.post("/update-metadata")
async def update_metadata(data: UpdateMetadataRequest):
    """
    Handle metadata versioning and new CID generation.
    """
    metadata = await nft_service.generate_profile_metadata(data.user_id, data.attributes)
    cid = await nft_service.upload_to_ipfs(metadata)
    
    return {
        "status": "success",
        "mint_address": data.mint_address,
        "new_cid": cid,
        "metadata": metadata,
        "message": "Updated metadata version generated. User must now sync to on-chain."
    }

@router.get("/user-nfts")
async def get_user_nfts(user_id: str):
    """
    Fetch all NFT records for a candidate.
    """
    db = get_supabase()
    response = db.table("nft_records").select("*").eq("user_id", user_id).execute()
    return response.data

@router.post("/register")
async def register_nft(user_id: str, mint: str, nft_type: str, cid: str):
    """
    Callback to store successful on-chain transaction.
    """
    await nft_service.register_nft(user_id, mint, nft_type, cid)
    return {"status": "registered"}
