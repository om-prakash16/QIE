import os
import io
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List
from models.schemas import MatchRequest

try:
    from langchain_openai import ChatOpenAI
    from langchain.prompts import PromptTemplate
    from langchain.output_parsers import PydanticOutputParser
    import PyPDF2
except ImportError:
    pass # Will gracefully fail to mock later if not installed

router = APIRouter()

# Structured Pydantic parsers for Langchain JSON deterministic output
class ParsedResume(BaseModel):
    skills: List[str] = Field(description="List of technical skills extracted")
    experience_years: int = Field(description="Total years of professional experience")
    roles: List[str] = Field(description="Job titles previously held")
    education: List[str] = Field(description="Degrees and universities")

class MatchResult(BaseModel):
    match_score: int = Field(description="Match score out of 100 based on skill overlap")
    missing_skills: List[str] = Field(description="Skills required by the job that the candidate lacks")

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "status": "mock",
            "parsed_data": {
                "skills": ["Rust", "Solana", "Next.js", "TypeScript (Mock)"],
                "experience_years": 5,
                "roles": ["Full Stack Engineer"],
                "education": ["B.S. Computer Science"]
            }
        }
    
    llm = ChatOpenAI(temperature=0, api_key=api_key, model="gpt-4o-mini")
    parser = PydanticOutputParser(pydantic_object=ParsedResume)
    
    prompt = PromptTemplate(
        template="Extract information from the following resume text.\n{format_instructions}\nResume:\n{resume}\n",
        input_variables=["resume"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    try:
        _input = prompt.format_prompt(resume=resume_text)
        output = llm.invoke(_input.to_messages())
        result = parser.parse(output.content)
        return {"status": "success", "parsed_data": result.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/match-jobs")
async def match_jobs(data: MatchRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "status": "mock",
            "match_score": 92,
            "missing_skills": ["Anchor testing framework"]
        }
        
    llm = ChatOpenAI(temperature=0, openai_api_key=api_key)
    parser = PydanticOutputParser(pydantic_object=MatchResult)
    
    prompt = PromptTemplate(
        template="Compare candidate skills to the Job Description.\n{format_instructions}\nSkills: {skills}\nJob: {job}\n",
        input_variables=["skills", "job"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    try:
        _input = prompt.format_prompt(skills=", ".join(data.profile_skills), job=data.job_description)
        output = llm.predict(_input.to_string())
        result = parser.parse(output)
        return {"status": "success", "result": result.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
