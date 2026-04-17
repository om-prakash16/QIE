"""
Skill Graph Intelligence Service.
Builds a relationship network between skills using vector proximity,
enabling semantic job matching instead of keyword matching.
"""
from typing import Dict, Any, List, Set
import math


class SkillGraphService:
    """
    Maintains a weighted skill relationship graph.
    Skills are connected by semantic proximity (e.g., Python -> Django -> REST API).
    Used for intelligent candidate-job matching beyond simple keyword overlap.
    """

    # Pre-built skill taxonomy with weighted edges (0.0 - 1.0 proximity)
    SKILL_GRAPH: Dict[str, Dict[str, float]] = {
        "python": {"django": 0.9, "fastapi": 0.92, "flask": 0.88, "pandas": 0.7, "machine learning": 0.6, "rest api": 0.75},
        "javascript": {"typescript": 0.95, "react": 0.85, "node.js": 0.88, "next.js": 0.82, "vue.js": 0.8, "rest api": 0.7},
        "typescript": {"javascript": 0.95, "react": 0.88, "next.js": 0.9, "angular": 0.8, "node.js": 0.85},
        "react": {"next.js": 0.92, "javascript": 0.85, "typescript": 0.88, "css": 0.6, "redux": 0.85, "tailwind css": 0.7},
        "next.js": {"react": 0.92, "typescript": 0.9, "vercel": 0.8, "node.js": 0.75, "rest api": 0.7},
        "rust": {"solana": 0.85, "anchor": 0.9, "systems programming": 0.88, "webassembly": 0.7, "smart contracts": 0.8},
        "solana": {"rust": 0.85, "anchor": 0.95, "web3": 0.9, "smart contracts": 0.92, "blockchain": 0.88},
        "anchor": {"solana": 0.95, "rust": 0.9, "smart contracts": 0.92, "web3": 0.85},
        "django": {"python": 0.9, "rest api": 0.85, "postgresql": 0.75, "orm": 0.8},
        "fastapi": {"python": 0.92, "rest api": 0.9, "pydantic": 0.88, "async": 0.8, "microservices": 0.75},
        "node.js": {"javascript": 0.88, "express": 0.9, "rest api": 0.85, "mongodb": 0.7, "microservices": 0.72},
        "docker": {"kubernetes": 0.85, "devops": 0.8, "ci/cd": 0.75, "microservices": 0.78},
        "kubernetes": {"docker": 0.85, "devops": 0.88, "cloud": 0.8, "microservices": 0.82},
        "postgresql": {"sql": 0.92, "supabase": 0.85, "database": 0.9, "django": 0.7},
        "machine learning": {"python": 0.8, "tensorflow": 0.88, "pytorch": 0.88, "data science": 0.9, "pandas": 0.75},
        "data science": {"machine learning": 0.9, "python": 0.75, "pandas": 0.88, "statistics": 0.85, "sql": 0.7},
        "go": {"microservices": 0.85, "rest api": 0.8, "docker": 0.7, "systems programming": 0.82},
        "web3": {"solana": 0.9, "ethereum": 0.88, "smart contracts": 0.92, "blockchain": 0.95, "defi": 0.8},
        "smart contracts": {"solana": 0.88, "rust": 0.8, "web3": 0.92, "anchor": 0.92, "blockchain": 0.9},
    }

    def get_related_skills(self, skill: str, depth: int = 2, min_proximity: float = 0.5) -> Dict[str, float]:
        """
        Traverse the skill graph from a starting skill up to `depth` hops.
        Returns a dict of {related_skill: combined_proximity_score}.
        """
        skill_lower = skill.lower()
        if skill_lower not in self.SKILL_GRAPH:
            return {}

        visited: Dict[str, float] = {skill_lower: 1.0}
        frontier = [(skill_lower, 1.0)]

        for _ in range(depth):
            next_frontier = []
            for current_skill, current_weight in frontier:
                neighbors = self.SKILL_GRAPH.get(current_skill, {})
                for neighbor, edge_weight in neighbors.items():
                    combined = current_weight * edge_weight
                    if combined >= min_proximity:
                        if neighbor not in visited or visited[neighbor] < combined:
                            visited[neighbor] = round(combined, 3)
                            next_frontier.append((neighbor, combined))
            frontier = next_frontier

        # Remove the starting skill itself
        visited.pop(skill_lower, None)
        return dict(sorted(visited.items(), key=lambda x: x[1], reverse=True))

    def parse_job_to_skill_graph(self, job_description: str, required_skills: List[str]) -> Dict[str, Any]:
        """
        Convert a job description into an expanded skill graph.
        Takes the explicit required_skills and expands each one using graph traversal.
        """
        expanded_graph: Dict[str, float] = {}

        for skill in required_skills:
            # Add the explicit skill with full weight
            expanded_graph[skill.lower()] = 1.0

            # Expand using relationships
            related = self.get_related_skills(skill, depth=2, min_proximity=0.5)
            for rel_skill, proximity in related.items():
                if rel_skill not in expanded_graph or expanded_graph[rel_skill] < proximity:
                    expanded_graph[rel_skill] = proximity

        return {
            "explicit_skills": [s.lower() for s in required_skills],
            "expanded_skill_graph": dict(sorted(expanded_graph.items(), key=lambda x: x[1], reverse=True)),
            "total_skills_in_graph": len(expanded_graph)
        }

    def match_candidate_to_job(
        self,
        candidate_skills: List[str],
        required_skills: List[str],
        proof_score: int = 500
    ) -> Dict[str, Any]:
        """
        Intelligent matching using the skill graph instead of keyword overlap.
        A candidate with FastAPI experience will match highly against a Django job,
        because they share deep proximity in the graph (both are Python web frameworks).
        """
        job_graph = self.parse_job_to_skill_graph("", required_skills)
        expanded = job_graph["expanded_skill_graph"]

        candidate_lower = [s.lower() for s in candidate_skills]

        # Direct matches (keyword overlap)
        direct_matches = [s for s in candidate_lower if s in [r.lower() for r in required_skills]]

        # Graph matches (semantic proximity)
        graph_matches: Dict[str, float] = {}
        for cand_skill in candidate_lower:
            if cand_skill in expanded:
                graph_matches[cand_skill] = expanded[cand_skill]

        # Calculate composite match score
        if not expanded:
            match_percentage = 0.0
        else:
            # Weighted average of all matched skills by their proximity
            total_weight = sum(expanded.values())
            matched_weight = sum(graph_matches.values())
            match_percentage = round((matched_weight / total_weight) * 100, 1)

        # Proof-Score bonus (candidates with higher proof scores get a 5-10% uplift)
        proof_bonus = min(10, (proof_score - 500) / 100 * 2) if proof_score > 500 else 0
        final_match = min(100, match_percentage + proof_bonus)

        # Determine fit tier
        if final_match >= 85:
            fit_tier = "Exceptional Fit"
        elif final_match >= 70:
            fit_tier = "Strong Fit"
        elif final_match >= 50:
            fit_tier = "Moderate Fit"
        else:
            fit_tier = "Weak Fit"

        # Identify missing critical skills
        missing = [s for s in [r.lower() for r in required_skills] if s not in candidate_lower]

        return {
            "match_percentage": round(final_match, 1),
            "fit_tier": fit_tier,
            "direct_keyword_matches": direct_matches,
            "graph_semantic_matches": graph_matches,
            "missing_critical_skills": missing,
            "proof_score_bonus": round(proof_bonus, 1),
            "recommendation": f"Candidate covers {len(graph_matches)}/{len(expanded)} skills in the expanded job graph."
        }
