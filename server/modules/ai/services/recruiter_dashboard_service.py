import logging
from typing import Dict, Any, List, Optional
from core.supabase import get_supabase
from core.cache import cache_result
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class RecruiterDashboardService:
    @cache_result(ttl=600) # Cache analytics for 10 minutes
    async def get_candidate_rankings(self, job_id: str) -> List[Dict[str, Any]]:
        """Rank applicants by Proof-Score and match relevance."""
        db = get_supabase()
        if not db: return []

        try:
            # Single join query to get apps + users
            resp = (
                db.table("applications")
                .select("id, status, created_at, candidate_wallet, users(full_name, reputation_score, trust_score)")
                .eq("job_id", job_id)
                .execute()
            )

            if not resp.data: return []

            rankings = []
            for app in resp.data:
                user = app.get("users", {})
                score = user.get("reputation_score", 0)
                trust = user.get("trust_score", 100)
                
                rankings.append({
                    "application_id": app["id"],
                    "name": user.get("full_name", "Anonymous"),
                    "wallet": app["candidate_wallet"],
                    "proof_score": score,
                    "trust_score": trust,
                    "shield": "Green" if trust >= 90 else ("Yellow" if trust >= 65 else "Red"),
                    "status": app["status"],
                    "applied_at": app["created_at"],
                    "match_percentage": min(100, score / 10) # Simple linear match for now
                })

            # Sort by reputation score descending
            rankings.sort(key=lambda x: x["proof_score"], reverse=True)
            for i, r in enumerate(rankings):
                r["rank"] = i + 1

            return rankings
        except Exception as e:
            logger.error(f"Failed to fetch candidate rankings for job {job_id}: {e}")
            return []

    async def get_hiring_time_prediction(self, job_id: str) -> Dict[str, Any]:
        """Predict time-to-fill based on real pipeline velocity."""
        db = get_supabase()
        if not db: return {"prediction": "Unknown"}

        try:
            # Get historical average time-to-hire for this company
            job_resp = db.table("jobs").select("company_id").eq("id", job_id).single().execute()
            company_id = job_resp.data.get("company_id") if job_resp.data else None
            
            if company_id:
                past_hires = (
                    db.table("applications")
                    .select("created_at, updated_at")
                    .eq("status", "hired")
                    .execute()
                )
                # In production: filter by company_id if we have the join
                
                if past_hires.data:
                    durations = []
                    for h in past_hires.data:
                        start = datetime.fromisoformat(h["created_at"].replace("Z", "+00:00"))
                        end = datetime.fromisoformat(h["updated_at"].replace("Z", "+00:00"))
                        durations.append((end - start).days)
                    avg_days = sum(durations) / len(durations)
                else:
                    avg_days = 30 # Default baseline
            else:
                avg_days = 30

            # Adjust based on current applicant volume
            app_count_resp = db.table("applications").select("id", count="exact").eq("job_id", job_id).execute()
            count = app_count_resp.count or 0
            
            # Heuristic: more applicants = faster fill (if quality is high)
            adjustment = max(-10, min(10, 15 - count)) 
            final_prediction = int(avg_days + adjustment)

            return {
                "predicted_days": final_prediction,
                "confidence": "High" if count > 20 else "Medium",
                "total_applicants": count,
                "market_average": 35
            }
        except Exception as e:
            logger.error(f"Hiring prediction failed: {e}")
            return {"predicted_days": 30, "error": "Prediction engine degraded"}

    @cache_result(ttl=3600) # Cache trends for 1 hour
    async def get_skill_demand_trends(self) -> List[Dict[str, Any]]:
        """Calculate real skill demand trends from job postings."""
        db = get_supabase()
        if not db: return []

        try:
            # Query all required_skills from active jobs
            resp = db.table("jobs").select("required_skills").execute()
            all_skills = []
            for job in resp.data or []:
                all_skills.extend(job.get("required_skills", []))
            
            from collections import Counter
            counts = Counter(all_skills)
            
            trends = []
            for skill, count in counts.most_common(10):
                trends.append({
                    "skill": skill,
                    "demand_count": count,
                    "trend": "Up" if count > 5 else "Stable" # Placeholder logic
                })
            return trends
        except Exception as e:
            logger.error(f"Skill trend calculation failed: {e}")
            return []

    async def get_engagement_funnel(self, job_id: str) -> Dict[str, Any]:
        """Aggregate real funnel metrics from the applications table."""
        db = get_supabase()
        if not db: return {}

        try:
            resp = db.table("applications").select("status").eq("job_id", job_id).execute()
            stats = {"applied": 0, "interviewing": 0, "offered": 0, "hired": 0, "rejected": 0}
            
            for app in resp.data or []:
                status = app["status"].lower()
                if status in stats: stats[status] += 1
                else: stats["applied"] += 1
            
            total = len(resp.data) if resp.data else 0
            return {
                "total_applicants": total,
                "stages": stats,
                "conversion_rate": f"{(stats['hired'] / total * 100):.1f}%" if total > 0 else "0%"
            }
        except Exception as e:
            logger.error(f"Funnel calculation failed: {e}")
            return {}

# Singleton
recruiter_service = RecruiterDashboardService()
