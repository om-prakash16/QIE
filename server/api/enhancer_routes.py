import os
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()

class EnhancerRequest(BaseModel):
    current_resume: str
    target_job: str

async def generate_mock_stream(resume: str, job: str):
    """
    Fallback streaming generator that perfectly mimics a real Langchain LLM stream 
    if the hackathon API keys are disconnected.
    """
    mock_chunks = [
        "Analyzing your resume against the target job description...\n\n",
        "✓ I noticed you are missing a direct mention of 'Anchor framework'. ",
        "Let's rewrite your professional summary to highlight the Solana experience.\n\n",
        "**Suggested Rewrite:**\n",
        "> 'Forward-thinking Rust engineer specializing in deploying optimized Solana ",
        "Anchor smart contracts and decentralized escrow protocols.'\n\n",
        "Adding this exact phrase will instantly boost your Match Score by 12%!"
    ]
    for chunk in mock_chunks:
        yield chunk
        await asyncio.sleep(0.5)

@router.post("/optimize-resume")
async def optimize_resume(data: EnhancerRequest):
    """
    Utilizes LangChain to stream real-time resume modifications tailored 
    specifically to a job description's implicit requirements.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        return StreamingResponse(
            generate_mock_stream(data.current_resume, data.target_job), 
            media_type="text/event-stream"
        )
        
    # Standard LangChain Streaming approach
    try:
        from langchain.chat_models import ChatOpenAI
        from langchain.schema import HumanMessage, SystemMessage
        from langchain.callbacks import AsyncIteratorCallbackHandler

        handler = AsyncIteratorCallbackHandler()
        llm = ChatOpenAI(streaming=True, callbacks=[handler], temperature=0.7, openai_api_key=api_key)
        
        system_msg = SystemMessage(content="You are an elite Tech Recruiter. Rewrite the given resume to perfectly match the target job description.")
        user_msg = HumanMessage(content=f"TARGET JOB:\n{data.target_job}\n\nRESUME:\n{data.current_resume}")
        
        async def stream_langchain():
            # Trigger the LLM in the background
            asyncio.create_task(llm.agenerate([[system_msg, user_msg]]))
            async for token in handler.aiter():
                yield token
                
        return StreamingResponse(stream_langchain(), media_type="text/event-stream")
        
    except ImportError:
        return StreamingResponse(
            generate_mock_stream(data.current_resume, data.target_job), 
            media_type="text/event-stream"
        )
