import os
import httpx
from typing import Dict, Any, List

class GitHubEvaluator:
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.headers = {"Authorization": f"token {self.github_token}"} if self.github_token else {}
        self.base_url = "https://api.github.com"

    async def get_user_score(self, username: str) -> Dict[str, Any]:
        """
        Calculates developer credibility using repository complexity and activity.
        """
        async with httpx.AsyncClient(headers=self.headers) as client:
            try:
                # 1. Fetch repos
                repos_resp = await client.get(f"{self.base_url}/users/{username}/repos?per_page=100")
                if repos_resp.status_code != 200:
                    return {"error": "User not found", "score": 0}
                
                repos = repos_resp.json()
                
                # 2. Analyze complexity
                total_stars = sum(r.get("stargazers_count", 0) for r in repos)
                total_forks = sum(r.get("forks_count", 0) for r in repos)
                unique_langs = len(set(r.get("language") for r in repos if r.get("language")))
                
                # 3. Commit frequency (Approximate)
                activity_score = len(repos) * 2 # Placeholder logic
                
                # Formula: (Complexity * 0.4) + (Popularity * 0.3) + (Variety * 0.3)
                complexity_score = min(len(repos) * 10, 100)
                popularity_score = min(total_stars * 5, 100)
                variety_score = min(unique_langs * 20, 100)
                
                final_score = int((complexity_score * 0.4) + (popularity_score * 0.3) + (variety_score * 0.3))
                
                return {
                    "username": username,
                    "score": final_score,
                    "metrics": {
                        "stars": total_stars,
                        "forks": total_forks,
                        "repos": len(repos),
                        "languages": unique_langs
                    }
                }
            except Exception as e:
                return {"error": str(e), "score": 0}
