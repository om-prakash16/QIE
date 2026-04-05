import os
import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from core.supabase import get_supabase

class NFTService:
    def __init__(self):
        self.pinata_key = os.getenv("PINATA_API_KEY")
        self.pinata_secret = os.getenv("PINATA_SECRET_KEY")

    def generate_profile_metadata(self, user_data: Dict[str, Any], attributes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Creates a JSON metadata structure following Metaplex standards.
        """
        return {
            "name": f"SkillProof Profile: {user_data.get('full_name', 'Professional')}",
            "symbol": "SKILL",
            "description": "AI-Verified Professional Identity on Solana",
            "image": user_data.get("avatar_url", "https://ipfs.io/ipfs/placeholder"),
            "external_url": f"https://skillproof.ai/u/{user_data.get('wallet_address')}",
            "attributes": attributes,
            "properties": {
                "files": [{"uri": user_data.get("avatar_url"), "type": "image/png"}],
                "category": "image"
            }
        }

    def generate_skill_metadata(self, skill_name: str, score: int, level: str) -> Dict[str, Any]:
        """
        Creates a skill certificate metadata structure.
        """
        return {
            "name": f"{skill_name} Skill Certificate",
            "symbol": "SKILL-CERT",
            "description": f"Verified mastery of {skill_name}",
            "image": f"https://ipfs.io/ipfs/cert_placeholder_{level.lower()}",
            "attributes": [
                {"trait_type": "Skill", "value": skill_name},
                {"trait_type": "Score", "value": score},
                {"trait_type": "Level", "value": level},
                {"trait_type": "Verified By", "value": "SkillProof AI"}
            ]
        }

    async def upload_to_ipfs(self, metadata: Dict[str, Any]) -> str:
        """
        Pins the metadata to IPFS and returns the CID.
        Currently uses a mock hash generation for demo purposes.
        """
        metadata_json = json.dumps(metadata, sort_keys=True)
        cid = "Qm" + hashlib.sha256(metadata_json.encode()).hexdigest()[:44]
        
        # Real pinning logic would be added here
        return cid

    async def register_nft(self, wallet: str, mint: str, nft_type: str, cid: str):
        """
        Stores the NFT mint and CID in the database.
        """
        db = get_supabase()
        if db:
            db.table("nft_records").insert({
                "nft_mint": mint,
                "owner_wallet": wallet,
                "nft_type": nft_type,
                "metadata_cid": cid,
                "last_synced_at": datetime.utcnow().isoformat()
            }).execute()
            
            # Update user profile with latest on-chain reference
            if nft_type == "profile":
                db.table("users").update({"current_ipfs_cid": cid}).eq("wallet_address", wallet).execute()

    async def anchor_job(self, job_id: str, company_wallet: str) -> str:
        """
        Anchors a job post ID and company wallet to Solana.
        Returns a mock PDA address.
        """
        # Logic to call Anchor program to initialize_job_pda
        seed = f"job_{job_id}"
        mock_pda = "JobPDA_" + hashlib.sha256(seed.encode()).hexdigest()[:32]
        return mock_pda

    async def anchor_application(self, app_id: str, job_pda: str, candidate_wallet: str) -> str:
        """
        Anchors an application record linked to a job PDA.
        Returns a mock application PDA address.
        """
        # Logic to call Anchor program to submit_application_pda
        seed = f"app_{app_id}"
        mock_app_pda = "AppPDA_" + hashlib.sha256(seed.encode()).hexdigest()[:32]
        return mock_app_pda
