from typing import Dict, Any, List

class ProofScoreService:
    def __init__(self):
        # Configurable weights for SaaS architecture
        self.weights = {
            "skill_score": 0.4,
            "github_score": 0.3,
            "project_score": 0.3
        }

    async def calculate_proof_score(self, scores: Dict[str, float]) -> Dict[str, Any]:
        """
        Calculates the aggregate Proof Score from multiple signals.
        """
        final_score = 0
        for key, weight in self.weights.items():
            final_score += scores.get(key, 0) * weight
            
        final_score = round(final_score, 2)
        
        # Determine reputation level
        level = "Junior"
        if final_score >= 90: level = "Platinum"
        elif final_score >= 80: level = "Gold"
        elif final_score >= 70: level = "Silver"
        elif final_score >= 50: level = "Bronze"

        return {
            "total_score": final_score,
            "breakdown": {
                "skill_contribution": scores.get("skill_score", 0) * self.weights["skill_score"],
                "github_contribution": scores.get("github_score", 0) * self.weights["github_score"],
                "project_contribution": scores.get("project_score", 0) * self.weights["project_score"]
            },
            "level": level,
            "weights_used": self.weights
        }
