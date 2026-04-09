import os
from datetime import datetime
from typing import Dict, Any, Optional
from core.supabase import get_supabase
from modules.nft.service import NFTService

class DataSyncService:
    def __init__(self):
        self.db = get_supabase()
        self.nft_service = NFTService()

    async def create_metadata_snapshot(self, 
                                     user_id: str, 
                                     entity_type: str = "profile") -> Dict[str, Any]:
        """
        1. Fetch latest data from Supabase
        2. Generate IPFS Metadata
        3. Store in metadata_versions
        4. Update sync_status to 'pending'
        """
        if not self.db:
            return {"error": "Database not connected"}

        # Fetch user data
        user_resp = self.db.table("users").select("*").eq("id", user_id).single().execute()
        user_data = user_resp.data if user_resp.data else {}
        
        # Generate Metadata & CID
        # Note: In a real app, attributes would be dynamic
        attributes = [{"trait_type": "Identity", "value": "AI-Verified"}]
        metadata = self.nft_service.generate_profile_metadata(user_data, attributes)
        cid = await self.nft_service.upload_to_ipfs(metadata)

        # Get latest version number
        version_resp = self.db.table("metadata_versions") \
            .select("version_number") \
            .eq("user_id", user_id) \
            .order("version_number", desc=True) \
            .limit(1) \
            .execute()
        
        next_version = (version_resp.data[0]["version_number"] + 1) if version_resp.data else 1

        # Record new version
        self.db.table("metadata_versions").insert({
            "user_id": user_id,
            "entity_type": entity_type,
            "cid": cid,
            "version_number": next_version,
            "metadata_json": metadata
        }).execute()

        # Update sync status
        sync_data = {
            "user_id": user_id,
            "entity_type": entity_type,
            "current_state": "pending",
            "latest_cid": cid,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        self.db.table("sync_status").upsert(sync_data, on_conflict="user_id,entity_type").execute()

        return {
            "status": "pending",
            "cid": cid,
            "version": next_version,
            "message": "Metadata staged in IPFS. Pending on-chain synchronization."
        }

    async def get_sync_status(self, user_id: str, entity_type: str = "profile") -> Dict[str, Any]:
        """
        Returns the current sync state for a user entity.
        """
        if not self.db:
            return {}
            
        response = self.db.table("sync_status") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("entity_type", entity_type) \
            .single() \
            .execute()
            
        return response.data if response.data else {"current_state": "not_initialized"}

    async def finalize_sync(self, 
                            user_id: str, 
                            tx_hash: str, 
                            cid: str, 
                            entity_type: str = "profile") -> Dict[str, Any]:
        """
        Updates the state to 'synced' once the Solana transaction is confirmed.
        """
        if not self.db:
            return {"error": "Database not connected"}

        # Conflict Check: Ensure the CID being finalized is still the latest staged CID
        status_resp = self.db.table("sync_status") \
            .select("latest_cid") \
            .eq("user_id", user_id) \
            .eq("entity_type", entity_type) \
            .single() \
            .execute()
            
        if status_resp.data and status_resp.data["latest_cid"] != cid:
            return {"error": "Conflict: A newer metadata version has been staged."}

        sync_update = {
            "current_state": "synced",
            "onchain_tx_hash": tx_hash,
            "last_synced_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        self.db.table("sync_status").update(sync_update) \
            .eq("user_id", user_id) \
            .eq("entity_type", entity_type) \
            .execute()
            
        return {"status": "synced", "tx_hash": tx_hash}
