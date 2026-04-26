import os
import numpy as np
import asyncio
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class JobMatcher:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.embeddings_model = (
            GoogleGenerativeAIEmbeddings(
                google_api_key=self.api_key, model="models/text-embedding-004"
            )
            if self.api_key
            else None
        )

    async def get_embedding(self, text: str) -> List[float]:
        if not self.embeddings_model:
            return np.random.rand(768).tolist()
        return await self.embeddings_model.aembed_query(text)

    async def get_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.embeddings_model:
            return [np.random.rand(768).tolist() for _ in texts]
        return await self.embeddings_model.aembed_documents(texts)

    async def match(
        self, profile_data: Dict[str, Any], job_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks jobs by semantic similarity to the user profile using batch embeddings.
        """
        if not profile_data or not job_list:
            return [
                {"job_id": j.get("id"), "title": j.get("title"), "match_score": 0.0}
                for j in job_list
            ]

        # 1. Prepare Profile Text
        profile_parts = [
            str(profile_data.get("full_name", "")),
            str(profile_data.get("bio", "")),
            ", ".join(profile_data.get("skills", [])) if isinstance(profile_data.get("skills"), list) else str(profile_data.get("skills", "")),
        ]
        profile_text = " ".join([p for p in profile_parts if p.strip()]).strip() or "General Candidate"
        
        # 2. Prepare Job Texts
        job_texts = []
        for job in job_list:
            job_parts = [
                str(job.get("title", "")),
                str(job.get("description", "")),
                ", ".join(job.get("skills_required", [])) if isinstance(job.get("skills_required"), list) else str(job.get("skills_required", "")),
            ]
            job_texts.append(" ".join([p for p in job_parts if p.strip()]).strip() or "General Job")

        # 3. Batch Embeddings (Parallel)
        # We need the profile embedding + all job embeddings
        all_texts = [profile_text] + job_texts
        embeddings = await self.get_embeddings_batch(all_texts)
        
        profile_vec = embeddings[0]
        job_vecs = embeddings[1:]

        # 4. Calculate Scores
        results = []
        for i, job in enumerate(job_list):
            try:
                similarity = cosine_similarity([profile_vec], [job_vecs[i]])[0][0]
            except Exception:
                similarity = 0.0

            match_score = round(float(similarity) * 100, 2)
            
            # Reasoning
            job_skills = set([s.lower() for s in job.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile_data.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = f"Matches your expertise in {', '.join(shared[:2])}" if shared else "High semantic overlap with your background."

            results.append({
                "job_id": job.get("id"),
                "title": job.get("title"),
                "match_score": match_score,
                "match_reason": reason,
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    async def match_candidates_to_job(
        self, job_data: Dict[str, Any], candidate_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidates by semantic similarity to a specific job using batch embeddings.
        """
        if not job_data or not candidate_list:
            return []

        # 1. Prepare Job Text
        job_parts = [
            str(job_data.get("title", "")),
            str(job_data.get("description", "")),
            ", ".join(job_data.get("skills_required", [])) if isinstance(job_data.get("skills_required"), list) else str(job_data.get("skills_required", "")),
        ]
        job_text = " ".join([p for p in job_parts if p.strip()]).strip() or "General Job Opening"
        
        # 2. Prepare Candidate Texts
        candidate_texts = []
        for candidate in candidate_list:
            profile = candidate.get("profile_data", {})
            candidate_parts = [
                str(candidate.get("full_name", "")),
                str(candidate.get("bio", "")),
                ", ".join(profile.get("skills", [])) if isinstance(profile.get("skills"), list) else str(profile.get("skills", "")),
            ]
            candidate_texts.append(" ".join([p for p in candidate_parts if p.strip()]).strip() or "Anonymous Talent")

        # 3. Batch Embeddings
        all_texts = [job_text] + candidate_texts
        embeddings = await self.get_embeddings_batch(all_texts)
        
        job_vec = embeddings[0]
        candidate_vecs = embeddings[1:]

        # 4. Calculate Scores
        results = []
        for i, candidate in enumerate(candidate_list):
            try:
                similarity = cosine_similarity([job_vec], [candidate_vecs[i]])[0][0]
            except Exception:
                similarity = 0.0

            match_score = round(float(similarity) * 100, 2)
            
            profile = candidate.get("profile_data", {})
            job_skills = set([s.lower() for s in job_data.get("skills_required", [])])
            cand_skills = set([s.lower() for s in profile.get("skills", [])])
            shared = list(job_skills.intersection(cand_skills))
            reason = f"Strong semantic match with focus on {', '.join(shared[:2])}" if shared else "High conceptual alignment with job requirements."

            results.append({
                "candidate_id": candidate.get("id"),
                "full_name": candidate.get("full_name"),
                "match_score": match_score,
                "match_reason": reason,
                "skills": profile.get("skills", []),
                "reputation": candidate.get("reputation_score", 0),
            })

        return sorted(results, key=lambda x: x["match_score"], reverse=True)
