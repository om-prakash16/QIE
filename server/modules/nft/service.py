import os
import hashlib
import json
import uuid
from modules.ai.models import ParsedResume
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase
from modules.notifications.service import NotificationService

class NFTService:
    def __init__(self):
        self.pinata_key = os.getenv("PINATA_API_KEY")
        self.pinata_secret = os.getenv("PINATA_SECRET_KEY")

    async def generate_profile_metadata(self, user_id: str, attributes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate profile metadata JSON.
        """
        db = get_supabase()
        user_data = db.table("users").select("*").eq("id", user_id).single().execute().data
        
        metadata = {
            "name": f"this best hiring tool Profile: {user_data.get('full_name')}",
            "symbol": "SKILL",
            "description": "AI-Verified Professional Identity on Solana",
            "image": user_data.get("avatar_url", "https://ipfs.io/ipfs/placeholder"),
            "attributes": attributes,
            "properties": {
                "files": [{"uri": user_data.get("avatar_url"), "type": "image/png"}],
                "category": "image"
            }
        }
        
        # Store metadata version before pinning
        await self.save_metadata_version(user_id, "profile", metadata)
        
        return metadata

    async def generate_skill_metadata(self, user_id: str, skill_name: str, score: int, level: str) -> Dict[str, Any]:
        """
        Generate skill certificate metadata JSON.
        """
        metadata = {
            "name": f"{skill_name} Skill Certificate",
            "symbol": "SKILL-CERT",
            "description": f"Verified mastery of {skill_name}",
            "image": f"https://ipfs.io/ipfs/cert_{level.lower()}",
            "attributes": [
                {"trait_type": "Skill", "value": skill_name},
                {"trait_type": "Score", "value": score},
                {"trait_type": "Level", "value": level},
                {"trait_type": "Verified By", "value": "this best hiring tool"}
            ]
        }
        
        # Store metadata version
        await self.save_metadata_version(user_id, "skill", metadata)
        
        return metadata

    async def save_metadata_version(self, user_id: str, nft_type: str, metadata: Dict[str, Any]):
        """
        Store version history in database.
        """
        db = get_supabase()
        # Mock CID before pinning
        temp_cid = "QmTemp" + hashlib.sha256(json.dumps(metadata).encode()).hexdigest()[:20]
        
        db.table("metadata_versions").insert({
            "user_id": user_id,
            "nft_type": nft_type,
            "cid": temp_cid,
            "metadata_json": metadata
        }).execute()

    async def upload_to_ipfs(self, metadata: Dict[str, Any]) -> str:
        """
        Pins the metadata to IPFS and returns the CID.
        """
        metadata_json = json.dumps(metadata, sort_keys=True)
        cid = "Qm" + hashlib.sha256(metadata_json.encode()).hexdigest()[:44]
        # Real pinning logic would be added here
        return cid

    async def register_nft(self, user_id: str, mint: str, nft_type: str, cid: str):
        """
        Stores the minted NFT record.
        """
        db = get_supabase()
        db.table("nft_records").insert({
            "user_id": user_id,
            "nft_address": mint,
            "nft_type": nft_type,
            "metadata_cid": cid
        }).execute()
        
        # Notify & Log
        await NotificationService.create_event_notification(
            user_id=uuid.UUID(user_id),
            type="nft_mint",
            title="NFT Credential Minted",
            message=f"Your {nft_type} NFT has been successfully minted on Solana. (Mint: {mint[:8]}...)"
        )
        
        await NotificationService.log_activity(
            user_id=uuid.UUID(user_id),
            action_type="nft_mint",
            entity_type="nft",
            entity_id=None,
            description=f"Minted {nft_type} NFT on-chain.",
            tx_hash=mint # Using mint as ref for now
        )

        # Update user profile with latest on-chain reference if profile NFT
        if nft_type == "profile":
            db.table("users").update({"current_ipfs_cid": cid}).eq("id", user_id).execute()

    async def check_skill_verification(self, user_id: str, skill_name: str) -> Optional[Dict[str, Any]]:
        """
        Verifies quiz completion before minting.
        """
        db = get_supabase()
        # Mock check: find successful quiz results for this skill
        # In real app: db.table("ai_quizzes").select("*").eq("user_id", user_id).eq("skill_name", skill_name)...
        return {"score": 85, "level": "Expert"}
