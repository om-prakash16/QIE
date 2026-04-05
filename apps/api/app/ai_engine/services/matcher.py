import os
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from langchain_openai import OpenAIEmbeddings

class JobMatcher:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.embeddings_model = OpenAIEmbeddings(
            openai_api_key=self.api_key, 
            model="text-embedding-3-small"
        ) if self.api_key else None

    async def get_embedding(self, text: str) -> List[float]:
        if not self.embeddings_model:
            # Return random vector for mock mode
            return np.random.rand(1536).tolist()
        return await self.embeddings_model.aembed_query(text)

    async def match(self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile.
        """
        profile_text = f"{profile_data.get('full_name')} {profile_data.get('bio')} {profile_data.get('skills')}"
        profile_vec = await self.get_embedding(profile_text)
        
        results = []
        for job in job_list:
            job_text = f"{job.get('title')} {job.get('description')} {job.get('requirements')}"
            job_vec = await self.get_embedding(job_text)
            
            # Using sklearn for cosine similarity
            similarity = cosine_similarity(
                [profile_vec], 
                [job_vec]
            )[0][0]
            
            results.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "match_score": round(similarity * 100, 2)
            })
            
        # Sort by match score descending
        return sorted(results, key=lambda x: x["match_score"], reverse=True)
