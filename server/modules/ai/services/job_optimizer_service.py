"""
AI Job Description Optimizer Service.
Analyzes job descriptions for missing skills, experience normalization,
salary benchmarking, and clarity scoring.
"""
from typing import Dict, Any, List, Optional
import random
import re


class JobOptimizerService:

    def analyze_job_description(self, title: str, description: str, skills: List[str]) -> Dict[str, Any]:
        """
        Analyze the job description and provide optimization suggestions.
        """
        # 1. Expand skills using Skill Graph logic (simulated for service isolation)
        suggestions = self._get_skill_suggestions(skills)
        
        # 2. Clarity Scoring (NLP logic)
        clarity = self._calculate_clarity_score(description)
        
        # 3. Experience Normalization
        exp_check = self._check_experience_alignment(title, skills)
        
        # 4. Salary Benchmarking
        salary_bench = self._get_salary_benchmark(title, skills)
        
        # 5. Rarity Index
        rarity = self._calculate_skill_rarity(skills)
        
        # Calculate overall score
        overall_score = int(
            clarity["score"] * 0.4 +
            exp_check["alignment_score"] * 0.3 +
            (100 - rarity["rarity_index"]) * 0.3
        )

        return {
            "overall_score": overall_score,
            "clarity": clarity,
            "skills_analysis": {
                "missing_skills": suggestions,
                "rarity": rarity
            },
            "experience_normalization": exp_check,
            "salary_benchmark": salary_bench,
            "recommendations": self._generate_recommendations(clarity, suggestions, exp_check, salary_bench)
        }

    def _get_skill_suggestions(self, current_skills: List[str]) -> List[str]:
        """Suggest proximate skills based on current skills."""
        # Simple proximity mapping
        proximity_map = {
            "solana": ["Anchor Framework", "Rust", "Web3.js"],
            "react": ["Next.js", "Tailwind CSS", "TypeScript"],
            "fastapi": ["Pydantic", "SQLAlchemy", "PostgreSQL"],
            "python": ["Pandas", "NumPy", "Scikit-Learn"],
            "rust": ["Wasm", "Tokio", "Zero-Knowledge Proofs"],
            "node.js": ["Express.js", "Prisma", "Docker"]
        }
        
        suggestions = []
        current_lower = [s.lower() for s in current_skills]
        for s in current_lower:
            if s in proximity_map:
                for suggestion in proximity_map[s]:
                    if suggestion.lower() not in current_lower:
                        suggestions.append(suggestion)
        
        return list(set(suggestions))[:5]

    def _calculate_clarity_score(self, description: str) -> Dict[str, Any]:
        """NLP-based clarity and structure score."""
        score = 50
        issues = []
        
        # Check for bullet points
        if "•" in description or "-" in description or "*" in description:
            score += 20
        else:
            issues.append("Lack of structured bullet points makes the JD harder to read.")
            
        # Check for length
        word_count = len(description.split())
        if word_count > 150:
            score += 20
        elif word_count < 50:
            score -= 10
            issues.append("JD is too brief; consider defining day-to-day responsibilities.")
            
        # Check for clarity keywords
        clarity_keywords = ["ownership", "responsibility", "deliver", "build", "collaborate"]
        found = [k for k in clarity_keywords if k in description.lower()]
        score += len(found) * 2
        
        return {
            "score": min(100, score),
            "label": "Excellent" if score > 85 else ("Good" if score > 65 else "Average"),
            "issues": issues
        }

    def _check_experience_alignment(self, title: str, skills: List[str]) -> Dict[str, Any]:
        """Align job title seniority with skill list complexity."""
        seniority_level = "junior"
        if any(w in title.lower() for w in ["senior", "lead", "architect", "staff", "principal"]):
            seniority_level = "senior"
        
        # High complexity skills
        complex_skills = ["kubernetes", "distributed systems", "cryptography", "rust", "optimization"]
        has_complex = any(s.lower() in complex_skills for s in skills)
        
        alignment_score = 100
        message = "Skills and title are well-aligned."
        
        if seniority_level == "senior" and len(skills) < 3:
            alignment_score = 60
            message = "Title is 'Senior' but requirements are thin. Consider adding architectural or leadership skills."
        elif seniority_level == "junior" and has_complex:
            alignment_score = 70
            message = "Title is 'Junior' but requirements include high-complexity systems. Consider re-labeling to Mid/Senior."
            
        return {
            "seniority_detected": seniority_level,
            "alignment_score": alignment_score,
            "message": message
        }

    def _get_salary_benchmark(self, title: str, skills: List[str]) -> Dict[str, Any]:
        """Calculate market FMV for the given JD components."""
        base_rates = {
            "engineer": 110000,
            "developer": 105000,
            "architect": 160000,
            "lead": 150000,
            "manager": 130000
        }
        
        base = 95000
        for k, v in base_rates.items():
            if k in title.lower():
                base = v
                break
                
        # Skill premium logic
        premium = 0
        rare_skills = ["rust", "solana", "zkp", "golang", "kubernetes"]
        for s in skills:
            if s.lower() in rare_skills:
                premium += 0.05
                
        fmv = int(base * (1 + premium))
        return {
            "fmv": fmv,
            "currency": "USD",
            "range": {
                "low": int(fmv * 0.9),
                "high": int(fmv * 1.1)
            },
            "insight": f"Market rate for this skill combination is approximately ${fmv:,}."
        }

    def _calculate_skill_rarity(self, skills: List[str]) -> Dict[str, Any]:
        """Determine how hard it will be to fill this role based on skill supply."""
        rarity_map = {
            "rust": 85,
            "solana": 92,
            "anchor": 95,
            "zkp": 98,
            "kubernetes": 75,
            "react": 30,
            "javascript": 20,
            "python": 25
        }
        
        scores = [rarity_map.get(s.lower(), 40) for s in skills]
        avg_rarity = sum(scores) / len(scores) if scores else 40
        
        label = "Common"
        if avg_rarity > 80: label = "Extreme"
        elif avg_rarity > 60: label = "High"
        elif avg_rarity > 40: label = "Moderate"
        
        return {
            "rarity_index": int(avg_rarity),
            "label": label,
            "predicted_days_to_fill": int(14 + (avg_rarity * 0.8))
        }

    def _generate_recommendations(self, clarity, suggestions, exp_check, salary_bench) -> List[str]:
        """Synthesize findings into actionable fixes."""
        recs = []
        if clarity["score"] < 70:
            recs.append("Structure your JD with bullet points to improve readability score.")
        if suggestions:
            recs.append(f"Add '{suggestions[0]}' to the requirements to reach a wider candidate pool.")
        if exp_check["alignment_score"] < 80:
            recs.append(exp_check["message"])
        if salary_bench["fmv"] > 140000:
            recs.append("This is a high-value role. Ensure your listed budget is above $140k to attract top-tier talent.")
            
        return recs[:3]
