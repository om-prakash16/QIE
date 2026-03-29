import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import json

try:
    from langchain.chat_models import ChatOpenAI
    from langchain.prompts import PromptTemplate
    from langchain.output_parsers import PydanticOutputParser
except ImportError:
    pass

router = APIRouter()

class SkillAssessment(BaseModel):
    wallet_address: str
    github_link: str
    quiz_score: int

class DynamicNFTMetadata(BaseModel):
    name: str = Field(description="Name of the Skill NFT")
    level: str = Field(description="Level e.g., Bronze, Silver, Gold, Platinum")
    attributes: list = Field(description="List of JSON attributes mapping to skills and scores")

@router.post("/update-skill-nft")
async def update_skill_nft(data: SkillAssessment):
    """
    Evaluates a candidate's recent activity (github commits, quiz scores)
    using Langchain, determines their new tier, and generates IPFS metadata.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    pinata_key = os.getenv("PINATA_API_KEY")
    pinata_secret = os.getenv("PINATA_SECRET_KEY")
    
    # AI NFT Level Generation Logic
    if not api_key:
        # Mock logic if API keys aren't added yet during hackathon
        level = "Silver" if data.quiz_score > 80 else "Bronze"
        metadata = {
            "name": f"Skillsutra Rust Developer - {level}",
            "description": "Dynamic Soulbound Skill Token",
            "image": f"ipfs://mock_{level.lower()}_image_hash",
            "attributes": [
                {"trait_type": "Level", "value": level},
                {"trait_type": "Quiz Score", "value": data.quiz_score}
            ]
        }
    else:
        llm = ChatOpenAI(temperature=0, openai_api_key=api_key)
        parser = PydanticOutputParser(pydantic_object=DynamicNFTMetadata)
        prompt = PromptTemplate(
            template="Based on a quiz score of {score} and github link {github}, generate the NFT metadata properties.\n{format_instructions}",
            input_variables=["score", "github"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        try:
            _input = prompt.format_prompt(score=data.quiz_score, github=data.github_link)
            output = llm.predict(_input.to_string())
            parsed_meta = parser.parse(output)
            metadata = {
                "name": parsed_meta.name,
                "description": "Dynamic Soulbound Skill Token",
                "image": "ipfs://dynamic_image_placeholder",
                "attributes": parsed_meta.attributes
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # 2. Pin to IPFS (Disabled locally unless Pinata API credentials provided)
    ipfs_hash = "QmExampleMockHash1234567890"
    if pinata_key and pinata_secret:
        # Here we would normally use httpx to POST to https://api.pinata.cloud/pinning/pinJSONToIPFS
        pass 
        
    return {
        "status": "success", 
        "wallet": data.wallet_address,
        "new_ipfs_hash": ipfs_hash,
        "metadata": metadata,
        "message": "AI generation complete. Ready to call update_skill_nft on Solana."
    }
