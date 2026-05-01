import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from core.supabase import get_supabase
from core.cache import cache_result
from modules.ai.services.github_service import github_scanner
from modules.ai.services.evaluation_service import EvaluationService

logger = logging.getLogger(__name__)

class ReputationScoringService:
    def __init__(self):
        self.evaluation_service = EvaluationService()

    @cache_result(ttl=300) # Cache scores for 5 minutes
    async def get_composite_score(self, wallet: str) -> Dict[str, Any]:
        """
        Calculates and returns the composite reputation score for a wallet.
        This is the main entry point for the reputation engine.
        """
        db = get_supabase()
        if not db:
            logger.warning(f"Database unavailable for scoring wallet {wallet}. Returning partial results.")
            return self._get_empty_score(wallet)

        # 1. Fetch sub-scores in parallel
        try:
            scores = await asyncio.gather(
                self._calc_skills_score(db, wallet),
                self._calc_project_score(db, wallet),
                self._calc_github_score(db, wallet),
                self._calc_job_score(db, wallet),
                self._calc_web3_score(db, wallet)
            )
        except Exception as e:
            logger.error(f"Error calculating sub-scores for {wallet}: {e}", exc_info=True)
            return self._get_empty_score(wallet)
            
        skills_score, project_score, github_score, job_score, web3_score = scores

        # 2. Apply weights (Production Configurable)
        weights = {
            "skills": 0.30,
            "projects": 0.25,
            "github": 0.20,
            "jobs": 0.15,
            "web3": 0.10,
        }

        total = (
            skills_score * weights["skills"]
            + project_score * weights["projects"]
            + github_score * weights["github"]
            + job_score * weights["jobs"]
            + web3_score * weights["web3"]
        ) * 10  # Scale to 0-1000

        total_score = min(int(total), 1000)
        level = self._determine_level(total_score)

        # 3. Persist and Log
        await self._persist_score(db, wallet, total_score, scores, weights)

        return {
            "wallet_address": wallet,
            "total_score": total_score,
            "max_score": 1000,
            "level": level,
            "breakdown": {
                "skills_score": skills_score,
                "project_score": project_score,
                "github_score": github_score,
                "job_score": job_score,
                "web3_score": web3_score,
            },
            "weights": weights,
            "updated_at": datetime.utcnow().isoformat()
        }

    def _determine_level(self, score: int) -> str:
        if score >= 800: return "Master"
        if score >= 600: return "Expert"
        if score >= 400: return "Intermediate"
        if score >= 200: return "Junior"
        return "Beginner"

    async def _calc_skills_score(self, db, wallet: str) -> float:
        """Aggregate score from passed skill quizzes."""
        try:
            res = db.table("skill_quizzes").select("score").eq("candidate_wallet", wallet).eq("passed", True).execute()
            if not res.data:
                return 0.0
            return min(sum(q["score"] for q in res.data) / len(res.data), 100.0)
        except Exception as e:
            logger.error(f"Skills score calculation failed for {wallet}: {e}")
            return 0.0

    async def _calc_project_score(self, db, wallet: str) -> float:
        """Aggregate score from project evaluations."""
        try:
            res = db.table("project_ledger").select("ai_score").eq("candidate_wallet", wallet).execute()
            if not res.data:
                return 0.0
            return min(sum(p["ai_score"] for p in res.data) / len(res.data), 100.0)
        except Exception as e:
            logger.error(f"Project score calculation failed for {wallet}: {e}")
            return 0.0

    async def _calc_github_score(self, db, wallet: str) -> float:
        """Detailed GitHub metric analysis."""
        try:
            user_res = db.table("users").select("dynamic_fields").eq("wallet_address", wallet).single().execute()
            if user_res.data:
                handle = user_res.data.get("dynamic_fields", {}).get("github_handle")
                if handle:
                    metrics = await github_scanner.analyze_repositories(handle)
                    m = metrics.get("metrics", {})
                    comp = m.get("architectural_complexity_handling", 50)
                    qual = m.get("code_quality_index", 50)
                    return (comp + qual) / 2.0
            return 0.0
        except Exception as e:
            logger.error(f"GitHub score calculation failed for {wallet}: {e}")
            return 0.0

    async def _calc_job_score(self, db, wallet: str) -> float:
        """Success rate of job applications."""
        try:
            res = db.table("applications").select("status").eq("candidate_wallet", wallet).execute()
            if not res.data:
                return 0.0
            hired = [a for a in res.data if a["status"] == "hired"]
            return min((len(hired) / len(res.data)) * 100, 100.0)
        except Exception as e:
            logger.error(f"Job score calculation failed for {wallet}: {e}")
            return 0.0

    async def _calc_web3_score(self, db, wallet: str) -> float:
        """Placeholder for Helius/On-chain activity integration."""
        # In production, this would hit Helius/Solana RPC
        return 45.0

    async def _persist_score(self, db, wallet, total, sub_scores, weights):
        """Asynchronously save score to history and update user record."""
        try:
            # Update user profile
            db.table("users").update({"reputation_score": total}).eq("wallet_address", wallet).execute()
            
            # Record in history
            db.table("reputation_history").insert({
                "wallet_address": wallet,
                "total_score": total,
                "skills_score": sub_scores[0],
                "project_score": sub_scores[1],
                "github_score": sub_scores[2],
                "job_score": sub_scores[3],
                "web3_score": sub_scores[4],
                "recorded_at": datetime.utcnow().isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Failed to persist reputation for {wallet}: {e}")

    def _get_empty_score(self, wallet: str) -> Dict[str, Any]:
        return {
            "wallet_address": wallet,
            "total_score": 0,
            "level": "Beginner",
            "breakdown": {k: 0.0 for k in ["skills_score", "project_score", "github_score", "job_score", "web3_score"]},
            "error": "Scoring engine partially unavailable"
        }

# Singleton
reputation_service = ReputationScoringService()
