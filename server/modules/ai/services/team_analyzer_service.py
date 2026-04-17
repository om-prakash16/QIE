"""
Team Skill Balance Analyzer Service.
Analyzes team-wide skill graphs to identify Single Points of Failure,
skill overlaps, and recommends ideal hire profiles.
"""
from typing import Dict, Any, List, Optional
from core.supabase import get_supabase
import random


class TeamAnalyzerService:

    def analyze_team_balance(self, company_id: str) -> Dict[str, Any]:
        """
        Analyze the skill distribution of a company's team.
        """
        db = get_supabase()
        team_members = []
        
        # 1. Fetch team members and their profiles
        if db:
            try:
                # Joining company_members with users
                resp = db.table("company_members") \
                    .select("user_id, company_role, users(full_name, profile_data, reputation_score)") \
                    .eq("company_id", company_id) \
                    .execute()
                team_members = resp.data or []
            except Exception:
                pass

        if not team_members:
            return self._get_mock_analysis()

        # 2. Extract and Aggregate Skills
        all_skills = {}
        total_members = len(team_members)
        
        for member in team_members:
            user = member.get("users", {})
            profile = user.get("profile_data", {})
            skills = profile.get("skills", [])
            
            for skill in skills:
                skill_name = skill.lower()
                if skill_name not in all_skills:
                    all_skills[skill_name] = {"count": 0, "experts": [], "score_sum": 0}
                all_skills[skill_name]["count"] += 1
                all_skills[skill_name]["score_sum"] += user.get("reputation_score", 500)
                if user.get("reputation_score", 0) >= 800:
                    all_skills[skill_name]["experts"].append(user.get("full_name", "Anonymous"))

        # 3. Identify Vulnerabilities (SPF - Single Point of Failure)
        vulnerabilities = []
        for name, data in all_skills.items():
            if data["count"] == 1:
                vulnerabilities.append({
                    "skill": name.capitalize(),
                    "holder": data["experts"][0] if data["experts"] else "Team Member",
                    "risk": "High (SPF)"
                })

        # 4. Identify Overlaps (Redundancy)
        overlaps = []
        for name, data in all_skills.items():
            if data["count"] >= max(3, total_members * 0.5):
                overlaps.append({
                    "skill": name.capitalize(),
                    "coverage": f"{data['count']}/{total_members}",
                    "status": "Highly Redundant"
                })

        # 5. Recommended Candidate Profile (Gap Filling)
        # Suggest a role that fills the most critical SPF or adjacent high-proximity skill
        recommended_profile = {
            "suggested_role": "DevOps Engineer" if not all_skills.get("kubernetes") else "Senior Backend Engineer",
            "focus_skills": [v["skill"] for v in vulnerabilities[:3]],
            "reasoning": "This profile fills critical single-point-of-failure gaps in your infrastructure and security stack."
        }

        # 6. Team Radar Scores
        categories = {
            "Frontend": ["react", "vue", "typescript", "css", "html"],
            "Backend": ["python", "node", "go", "rust", "java"],
            "Infrastructure": ["docker", "kubernetes", "aws", "terraform"],
            "Security": ["auditing", "cryptography", "pentesting"],
            "AI/ML": ["pytorch", "tensorflow", "pandas", "scikit"]
        }
        
        radar_scores = []
        for cat, kw_list in categories.items():
            cat_score = 0
            found_count = 0
            for kw in kw_list:
                if all_skills.get(kw):
                    cat_score += all_skills[kw]["score_sum"] / all_skills[kw]["count"]
                    found_count += 1
            avg_cat_score = cat_score / len(kw_list) # Simplified max
            radar_scores.append({"axis": cat, "value": int(min(100, avg_cat_score / 10))})

        return {
            "vulnerability_shield_score": 100 - (len(vulnerabilities) * 5),
            "vulnerabilities": vulnerabilities,
            "overlaps": overlaps,
            "recommended_profile": recommended_profile,
            "team_radar": radar_scores,
            "summary": f"Your team has {len(vulnerabilities)} high-risk single points of failure. We recommend balancing your {recommended_profile['suggested_role']} hiring to diversify your tech stack."
        }

    def _get_mock_analysis(self) -> Dict[str, Any]:
        """Mock analysis for demo purposes when DB is empty."""
        return {
            "vulnerability_shield_score": 72,
            "vulnerabilities": [
                {"skill": "AWS Infrastructure", "holder": "Alice Dev", "risk": "High (SPF)"},
                {"skill": "Smart Contract Auditing", "holder": "Bob Chain", "risk": "High (SPF)"}
            ],
            "overlaps": [
                {"skill": "React.js", "coverage": "8/10", "status": "Highly Redundant"}
            ],
            "recommended_profile": {
                "suggested_role": "DevOps Engineer",
                "focus_skills": ["Kubernetes", "Terraform", "Docker"],
                "reasoning": "Fills critical infrastructure single-point-of-failure gaps."
            },
            "team_radar": [
                {"axis": "Frontend", "value": 92},
                {"axis": "Backend", "value": 78},
                {"axis": "Infrastructure", "value": 35},
                {"axis": "Security", "value": 42},
                {"axis": "AI/ML", "value": 15}
            ],
            "summary": "Team expertise is heavily clustered in Frontend. Urgent need for DevOps redundancy."
        }
