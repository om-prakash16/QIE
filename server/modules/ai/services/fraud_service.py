import logging
import datetime
from typing import List, Dict, Any, Tuple, Optional
from core.supabase import get_supabase
from core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)

class AIFraudService:
    def __init__(self):
        self.baseline_trust_score = 100

    async def get_assessment_trust_report(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        """Fetch existing fraud analysis for an assessment."""
        db = get_supabase()
        if not db: return None
        
        try:
            res = db.table("fraud_logs").select("*").eq("assessment_id", assessment_id).single().execute()
            return res.data
        except Exception:
            return None

    async def process_telemetry(
        self, wallet: str, assessment_id: str, telemetry_events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyzes telemetry, calculates trust score, and persists results to the database.
        """
        trust_score, audit_log = self._analyze_telemetry(telemetry_events)
        status = self._determine_trust_status(trust_score)
        shield = self._determine_shield_status(trust_score)

        report = {
            "wallet_address": wallet,
            "assessment_id": assessment_id,
            "trust_score": trust_score,
            "status": status,
            "shield": shield,
            "audit_log": audit_log,
            "analyzed_at": datetime.datetime.utcnow().isoformat()
        }

        # Persist to database
        db = get_supabase()
        if db:
            try:
                db.table("fraud_logs").upsert(report, on_conflict="assessment_id").execute()
                # Update candidate trust aggregate
                await self._update_candidate_aggregate_trust(db, wallet)
            except Exception as e:
                logger.error(f"Failed to persist fraud report for {assessment_id}: {e}")

        return report

    async def _update_candidate_aggregate_trust(self, db, wallet: str):
        """Update the global trust score for a candidate based on all their assessments."""
        try:
            res = db.table("fraud_logs").select("trust_score").eq("wallet_address", wallet).execute()
            if res.data:
                avg_score = sum(r["trust_score"] for r in res.data) / len(res.data)
                db.table("users").update({"trust_score": int(avg_score)}).eq("wallet_address", wallet).execute()
        except Exception as e:
            logger.error(f"Failed to update aggregate trust for {wallet}: {e}")

    def _analyze_telemetry(
        self, telemetry_events: List[Dict[str, Any]]
    ) -> Tuple[int, List[Dict[str, Any]]]:
        deductions = 0
        audit_log = []
        tab_switches = 0

        for event in telemetry_events:
            event_type = event.get("type")
            timestamp = event.get("timestamp", datetime.datetime.utcnow().isoformat())
            details = event.get("details", {})

            if event_type == "tab_switch":
                duration = details.get("durationSeconds", 0)
                if duration > 5:
                    tab_switches += 1
                    penalty = 5
                    deductions += penalty
                    audit_log.append({
                        "timestamp": timestamp, "severity": "low",
                        "message": f"Lost window focus for {duration}s", "penalty": -penalty
                    })

            elif event_type == "paste":
                char_count = details.get("characterCount", 0)
                if char_count > 100:
                    penalty = 25
                    deductions += penalty
                    audit_log.append({
                        "timestamp": timestamp, "severity": "medium",
                        "message": f"Pasted {char_count} characters instantly", "penalty": -penalty
                    })

            elif event_type == "llm_watermark_match":
                prob = details.get("probability", 0)
                if prob > 0.85:
                    penalty = 50
                    deductions += penalty
                    audit_log.append({
                        "timestamp": timestamp, "severity": "high",
                        "message": f"AI generation detected ({prob*100}%)", "penalty": -penalty
                    })

        if tab_switches >= 5:
            deductions += 20
            audit_log.append({
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "severity": "medium", "message": "Frequent tab switching pattern", "penalty": -20
            })

        return max(0, self.baseline_trust_score - deductions), audit_log

    def _determine_shield_status(self, score: int) -> str:
        if score >= 90: return "Green"
        if score >= 65: return "Yellow"
        return "Red"

    def _determine_trust_status(self, score: int) -> str:
        if score >= 90: return "Verified Authentic"
        if score >= 65: return "Verified with Warnings"
        return "Disqualified (Fraud Alerts)"

# Singleton
fraud_service = AIFraudService()
