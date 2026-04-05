import os
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from core.postgres import get_db_connection
from core.supabase import get_supabase
from app.ai_engine.services.matcher import JobMatcher
from app.blockchain.service import NFTService

class JobService:
    def __init__(self):
        self.matcher = JobMatcher()
        self.nft_service = NFTService()

    async def create_job(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a job post in the database.
        """
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            job_id = str(uuid.uuid4())
            cur.execute(
                """
                INSERT INTO jobs (id, company_id, title, description, required_skills, experience_level, salary_range, job_type, employment_type, deadline, min_reputation_score, dynamic_fields)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, company_id, title, description, created_at
                """,
                (job_id, data.get('company_id'), data.get('title'), data.get('description'), 
                 data.get('required_skills'), data.get('experience_level'), data.get('salary_range'),
                 data.get('job_type'), data.get('employment_type'), data.get('deadline'),
                 data.get('min_reputation_score', 0), data.get('dynamic_fields', {}))
            )
            row = cur.fetchone()
            conn.commit()
            
            # --- Solana Anchor Integration ---
            job_pda = await self.nft_service.anchor_job(job_id, data.get('company_wallet', 'unknown'))
            cur.execute("UPDATE jobs SET solana_job_pda = %s WHERE id = %s", (job_pda, job_id))
            conn.commit()
            
            return {"id": str(row[0]), "status": "created", "solana_job_pda": job_pda, "created_at": row[4]}
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    async def apply_to_job(self, job_id: str, candidate_wallet: str) -> Dict[str, Any]:
        """
        Submits an application and triggers AI matching.
        """
        db = get_supabase()
        
        # 1. Fetch Job and Candidate data for AI matching
        job_data = db.table("jobs").select("*").eq("id", job_id).single().execute().data
        candidate_data = db.table("users").select("*").eq("wallet_address", candidate_wallet).single().execute().data
        
        # 2. Calculate AI Match Score
        matches = await self.matcher.match(candidate_data, [job_data])
        match_score = matches[0]["match_score"] if matches else 0
        
        # 3. Create application record
        app_id = str(uuid.uuid4())
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                """
                INSERT INTO applications (id, job_id, candidate_wallet, ai_match_score, status)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, status, ai_match_score
                """,
                (app_id, job_id, candidate_wallet, match_score, "applied")
            )
            row = cur.fetchone()
            conn.commit()

            # --- Solana Anchor Integration ---
            job_pda = job_data.get("solana_job_pda", "unknown")
            app_pda = await self.nft_service.anchor_application(app_id, job_pda, candidate_wallet)
            cur.execute("UPDATE applications SET solana_app_pda = %s WHERE id = %s", (app_pda, app_id))
            conn.commit()

            return {
                "id": str(row[0]), 
                "status": row[1], 
                "ai_match_score": float(row[2]),
                "solana_app_pda": app_pda,
                "on_chain_ready": True
            }
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    async def update_status(self, app_id: str, status: str) -> bool:
        """
        Updates the application status (hiring pipeline).
        """
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                "UPDATE applications SET status = %s WHERE id = %s",
                (status, app_id)
            )
            conn.commit()
            return True
        except Exception:
            conn.rollback()
            return False
        finally:
            cur.close()
            conn.close()
