import os
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class JobMatcher:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.embeddings_model = GoogleGenerativeAIEmbeddings(
            google_api_key=self.api_key, 
            model="models/text-embedding-004"
        ) if self.api_key else None

    async def get_embedding(self, text: str) -> List[float]:
        if not self.embeddings_model:
            # Return random vector for mock mode (Gemini uses 768 dims)
            return np.random.rand(768).tolist()
        return await self.embeddings_model.aembed_query(text)

    async def match(self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile.
        """
        # 1. Handle empty profile or jobs
        if not profile_data or not job_list:
            return [{"job_id": j.get("id"), "title": j.get("title"), "match_score": 0.0} for j in job_list]

        # Extract and clean profile text
        profile_parts = [
            str(profile_data.get('full_name', '')),
            str(profile_data.get('bio', '')),
            ", ".join(profile_data.get('skills', [])) if isinstance(profile_data.get('skills'), list) else str(profile_data.get('skills', ''))
        ]
        profile_text = " ".join([p for p in profile_parts if p.strip()]).strip() or "General Candidate"
        profile_vec = await self.get_embedding(profile_text)
        
        results = []
        for job in job_list:
            # Extract and clean job text
            job_parts = [
                str(job.get('title', '')),
                str(job.get('description', '')),
                ", ".join(job.get('skills_required', [])) if isinstance(job.get('skills_required'), list) else str(job.get('skills_required', ''))
            ]
            job_text = " ".join([p for p in job_parts if p.strip()]).strip() or "General Job"
            job_vec = await self.get_embedding(job_text)
            
            # 2. Using sklearn for cosine similarity with error handling
            try:
                similarity = cosine_similarity(
                    [profile_vec], 
                    [job_vec]
                )[0][0]
            except Exception:
                similarity = 0.0
            
            results.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "match_score": round(float(similarity) * 100, 2)
            })
            
        # 3. Sort by match score descending
        return sorted(results, key=lambda x: x["match_score"], reverse=True)
