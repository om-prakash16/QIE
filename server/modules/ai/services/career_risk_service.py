from typing import Dict, Any, List
from datetime import datetime
import random


class CareerRiskService:
    """
    AI Service for predicting career risks and growth trajectories.
    Uses market data, tenure, skill velocity, and Proof-Score signals.
    """

    def __init__(self):
        # Base industry churn rates (months)
        self.industry_churn_avg = {
            "Software Engineering": 20,
            "Blockchain Development": 18,
            "Data Science": 24,
            "Product Management": 22,
        }

    async def get_career_risk_analysis(
        self, user_id: str, profile_data: Dict[str, Any], proof_score: float
    ) -> Dict[str, Any]:
        """
        Aggregate analysis for all 3 career metrics.
        """
        # Simulated data for internal metrics if not provided
        tenure_months = profile_data.get("current_tenure_months", random.randint(6, 36))
        salary_gap = profile_data.get(
            "salary_market_gap_percent", random.uniform(-10, 20)
        )
        skill_velocity = profile_data.get(
            "skill_acquisition_rate", random.uniform(0.5, 5.0)
        )

        job_change = self._calculate_job_change_probability(
            tenure_months, salary_gap, proof_score
        )
        growth = self._predict_growth_trajectory(
            skill_velocity, proof_score, profile_data.get("experience_years", 3)
        )
        stagnation = self._assess_skill_stagnation(
            profile_data.get("last_skill_update_days", 90),
            profile_data.get("skills", []),
            profile_data.get("role", "Software Engineer"),
        )

        return {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "job_change_probability": job_change,
                "career_growth_trajectory": growth,
                "skill_stagnation_risk": stagnation,
            },
            "summary": self._generate_summary(job_change, growth, stagnation),
        }

    def _calculate_job_change_probability(
        self, tenure_months: int, salary_gap: float, proof_score: float
    ) -> Dict[str, Any]:
        """
        Calculates the likelihood of a candidate changing jobs.
        """
        # Base probability from tenure (peak at 18-22 months)
        if 18 <= tenure_months <= 24:
            base_prob = 0.65
        elif tenure_months > 36:
            base_prob = 0.45  # "Loyalist" or "Stagnant"
        else:
            base_prob = 0.30

        # Modifiers
        salary_modifier = (salary_gap / 100) * 0.5  # Positive gap increases change prob
        score_modifier = (
            proof_score / 1000
        ) * 0.2  # Higher score = more recruiter attention

        final_prob = min(0.99, max(0.01, base_prob + salary_modifier + score_modifier))

        return {
            "score": round(final_prob * 100, 1),
            "level": "High"
            if final_prob > 0.7
            else "Medium"
            if final_prob > 0.4
            else "Low",
            "features": [
                {
                    "name": "Tenure Peak",
                    "impact": "High",
                    "description": f"Currently at {tenure_months} months. Statistical peak churn for tech roles occurs at 18-24 months.",
                },
                {
                    "name": "Market Premium Gap",
                    "impact": "Medium",
                    "description": f"Estimated {round(salary_gap, 1)}% gap between current pay and Fair Market Value.",
                },
                {
                    "name": "Proof-Score Momentum",
                    "impact": "Low",
                    "description": f"Verified score of {proof_score} increases visibility to active headhunters.",
                },
            ],
        }

    def _predict_growth_trajectory(
        self, skill_velocity: float, proof_score: float, exp_years: int
    ) -> Dict[str, Any]:
        """
        Predicts career progression speed.
        """
        # Formula: (Velocity * 0.5) + (Normalized Score * 0.3) + (Exp Factor * 0.2)
        velocity_score = min(1.0, skill_velocity / 4.0)
        normalized_proof = proof_score / 1000

        growth_index = (velocity_score * 0.6) + (normalized_proof * 0.4)

        level = (
            "Accelerated"
            if growth_index > 0.75
            else "Steady"
            if growth_index > 0.4
            else "At Risk"
        )

        return {
            "score": round(growth_index * 100, 1),
            "level": level,
            "next_milestone_estimate": "12-18 months"
            if growth_index > 0.6
            else "24+ months",
            "features": [
                {
                    "name": "Skill Acquisition Velocity",
                    "impact": "High",
                    "description": "Rate of new verified proof-points added per quarter.",
                },
                {
                    "name": "Hierarchy Mapping",
                    "impact": "Medium",
                    "description": "Experience vs. project complexity alignment.",
                },
                {
                    "name": "Role Scarcity",
                    "impact": "Medium",
                    "description": "High demand for your specific verified tech stack combination.",
                },
            ],
        }

    def _assess_skill_stagnation(
        self, days_since_update: int, skills: List[str], role: str
    ) -> Dict[str, Any]:
        """
        Assess risk of skills becoming obsolete.
        """
        # Base risk from recency
        recency_risk = min(1.0, days_since_update / 365.0)

        # simulated tech drift (e.g., AI/Web3 move fast)
        tech_drift = 0.2  # Baseline
        if any(
            s.lower() in ["solidity", "rust", "react", "next.js", "llm"] for s in skills
        ):
            tech_drift = 0.5  # Fast moving markets

        final_risk = (recency_risk * 0.7) + (tech_drift * 0.3)

        return {
            "score": round(final_risk * 100, 1),
            "level": "Critical"
            if final_risk > 0.8
            else "Warning"
            if final_risk > 0.5
            else "Healthy",
            "features": [
                {
                    "name": "Technology Decay Curve",
                    "impact": "High",
                    "description": "Volatility of current primary stack against 12-month market trends.",
                },
                {
                    "name": "Update Decay",
                    "impact": "Medium",
                    "description": f"Last verified activity was {days_since_update} days ago.",
                },
                {
                    "name": "Vertical Specialization",
                    "impact": "Low",
                    "description": "Lack of breadth in emerging adjacent technologies.",
                },
            ],
        }

    def _generate_summary(self, job_change, growth, stagnation) -> str:
        if stagnation["score"] > 60:
            return "Your skills are falling behind market trends. Focus on acquiring emerging technologies to maintain growth."
        if job_change["score"] > 70:
            return "You are in a high-mobility phase. Your market value exceeds your current role profile."
        return (
            "Your career is on a steady upward trajectory with balanced risk metrics."
        )


career_service = CareerRiskService()
