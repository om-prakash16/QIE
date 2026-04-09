import uuid
from typing import List, Dict, Any, Optional
from modules.notifications.schemas import NotificationCreate, ActivityLogCreate
from core.supabase import get_supabase
from modules.nft.service import NFTService

class SyncService:
    def __init__(self):
        self.nft_service = NFTService()

    async def trigger_metadata_sync(self, user_id: uuid.UUID, entity_type: str, entity_id: Optional[uuid.UUID] = None):
        """
        Orchestrates IPFS pinning and pending state management.
        """
        db = get_supabase()
        
        # Fetch current data for metadata generation
        if entity_type == 'profile':
            user_data = db.table("users").select("*").eq("id", str(user_id)).single().execute().data
            # In a real app: format resume/skills into Metaplex JSON
            metadata = await self.nft_service.generate_profile_metadata(str(user_id), [])
        else:
            # Handle other entity types (skill, project)
            metadata = {}

        # Upload to IPFS
        cid = await self.nft_service.upload_to_ipfs(metadata)
        
        # Store in metadata_versions (trigger handles version_number)
        db.table("metadata_versions").insert({
            "user_id": str(user_id),
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "cid": cid,
            "metadata_json": metadata
        }).execute()
        
        # Mark Sync Status as PENDING
        db.table("sync_status").upsert({
            "user_id": str(user_id),
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "current_state": "pending",
            "latest_cid": cid,
            "updated_at": "now()"
        }, on_conflict="user_id, entity_type, entity_id").execute()
        
        return {"status": "pending", "cid": cid}

    async def finalize_blockchain_sync(self, user_id: uuid.UUID, entity_type: str, tx_hash: str):
        """
        Transition to SYNCED state after Solana transaction confirmation.
        """
        db = get_supabase()
        
        db.table("sync_status") \
            .update({
                "current_state": "synced",
                "onchain_tx_hash": tx_hash,
                "last_synced_at": "now()",
                "error_message": None
            }) \
            .eq("user_id", str(user_id)) \
            .eq("entity_type", entity_type) \
            .execute()
        
        return {"status": "synced", "tx_hash": tx_hash}

    async def mark_sync_failed(self, user_id: uuid.UUID, entity_type: str, error: str):
        """
        Handle synchronization failures.
        """
        db = get_supabase()
        db.table("sync_status") \
            .update({
                "current_state": "failed",
                "error_message": error
            }) \
            .eq("user_id", str(user_id)) \
            .eq("entity_type", entity_type) \
            .execute()
