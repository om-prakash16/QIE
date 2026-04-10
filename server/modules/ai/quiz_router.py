"""
Skill Quiz Routes.
AI-powered skill verification: generate quizzes, evaluate answers, trigger NFT minting.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from core.supabase import get_supabase
from datetime import datetime
import os
import json
import uuid

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class QuizRequest(BaseModel):
    skill: str
    difficulty: str = "intermediate"
    question_count: int = 10
    wallet_address: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: Dict[str, str]  # { "q1": "A", "q2": "C" }
    wallet_address: str

# ─── Quiz Generation ──────────────────────────────────────────────────

@router.post("/generate")
async def generate_quiz(data: QuizRequest):
    """Generate an AI-powered skill assessment quiz."""
    api_key = os.getenv("GOOGLE_API_KEY")
    
    # Mock quiz generation (used when no OpenAI key)
    mock_questions = []
    skill = data.skill
    
    question_bank = {
        "Rust": [
            {"id": "q1", "text": "What is the ownership model in Rust?", "options": ["A) Garbage collection", "B) Manual memory management", "C) Ownership with borrowing rules", "D) Reference counting only"], "correct": "C"},
            {"id": "q2", "text": "What does the 'borrow checker' enforce?", "options": ["A) Type safety", "B) Memory safety through references", "C) Thread safety", "D) All of the above"], "correct": "D"},
            {"id": "q3", "text": "What is a trait in Rust?", "options": ["A) A class definition", "B) A collection of methods defined for types", "C) A variable type", "D) A module"], "correct": "B"},
            {"id": "q4", "text": "What keyword creates a mutable variable?", "options": ["A) var", "B) let mut", "C) mutable", "D) dynamic"], "correct": "B"},
            {"id": "q5", "text": "What is 'match' in Rust?", "options": ["A) String comparison", "B) Pattern matching expression", "C) Loop construct", "D) Import statement"], "correct": "B"},
        ],
        "Solana": [
            {"id": "q1", "text": "What consensus mechanism does Solana use?", "options": ["A) Proof of Work", "B) Proof of Stake only", "C) Proof of History + Tower BFT", "D) Delegated PoS"], "correct": "C"},
            {"id": "q2", "text": "What is a PDA in Solana?", "options": ["A) Public Data Address", "B) Program Derived Address", "C) Private Data Account", "D) Protocol Data API"], "correct": "B"},
            {"id": "q3", "text": "What framework is used for Solana smart contracts?", "options": ["A) Hardhat", "B) Truffle", "C) Anchor", "D) Foundry"], "correct": "C"},
            {"id": "q4", "text": "What is the minimum unit of SOL called?", "options": ["A) Wei", "B) Satoshi", "C) Lamport", "D) Gwei"], "correct": "C"},
            {"id": "q5", "text": "What is rent in Solana?", "options": ["A) Transaction fee", "B) Cost to keep data stored on-chain", "C) Validator reward", "D) Staking fee"], "correct": "B"},
        ],
        "TypeScript": [
            {"id": "q1", "text": "What is a union type in TypeScript?", "options": ["A) A type that can be one of several types", "B) A combined interface", "C) A generic type", "D) An enum"], "correct": "A"},
            {"id": "q2", "text": "What is the 'unknown' type used for?", "options": ["A) Any value, no type checking", "B) A type-safe counterpart to 'any'", "C) Undefined values", "D) Null values"], "correct": "B"},
            {"id": "q3", "text": "What are generics used for?", "options": ["A) Styling", "B) Creating reusable type-safe components", "C) Importing modules", "D) Error handling"], "correct": "B"},
            {"id": "q4", "text": "What does 'as const' assertion do?", "options": ["A) Makes variables constant", "B) Narrows type to literal values", "C) Prevents reassignment", "D) Creates enums"], "correct": "B"},
            {"id": "q5", "text": "What is a type guard?", "options": ["A) Access modifier", "B) Runtime type narrowing expression", "C) Error boundary", "D) Import guard"], "correct": "B"},
        ],
    }

    # Get questions for the skill or generate generic ones
    base_questions = question_bank.get(skill, [
        {"id": f"q{i}", "text": f"Sample {skill} question {i}", "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"], "correct": "B"}
        for i in range(1, 6)
    ])

    # Extend to requested count
    questions = base_questions[:data.question_count]
    
    # If we have an API key, use LangChain to generate real questions
    if api_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            from langchain.prompts import PromptTemplate

            llm = ChatGoogleGenerativeAI(temperature=0.7, google_api_key=api_key, model="gemini-1.5-flash")
            prompt = PromptTemplate(
                template="""Generate {count} multiple choice questions to assess {skill} at {difficulty} level.
                
Return ONLY a JSON array with this exact format:
[{{"id": "q1", "text": "question text", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "C"}}]

Questions should be practical and test real-world knowledge.""",
                input_variables=["count", "skill", "difficulty"]
            )
            result = llm.invoke(prompt.format(
                count=data.question_count,
                skill=data.skill,
                difficulty=data.difficulty
            ))
            questions = json.loads(result.content)
        except Exception:
            pass  # Fall back to mock questions

    quiz_id = str(uuid.uuid4())

    # Store quiz in database
    db = get_supabase()
    if db:
        db.table("skill_quizzes").insert({
            "id": quiz_id,
            "candidate_wallet": data.wallet_address,
            "skill_name": data.skill,
            "difficulty": data.difficulty,
            "questions": questions,
        }).execute()

    # Return questions without correct answers
    safe_questions = [
        {"id": q["id"], "text": q["text"], "options": q["options"]}
        for q in questions
    ]

    return {
        "quiz_id": quiz_id,
        "skill": data.skill,
        "difficulty": data.difficulty,
        "question_count": len(safe_questions),
        "time_limit_minutes": 15,
        "questions": safe_questions
    }


@router.post("/evaluate")
async def evaluate_quiz(data: QuizSubmission):
    """Evaluate quiz answers and determine if skill NFT should be minted."""
    db = get_supabase()
    
    # Get the quiz with correct answers
    questions = None
    if db:
        response = db.table("skill_quizzes").select("*") \
            .eq("id", data.quiz_id).single().execute()
        if response.data:
            questions = response.data["questions"]
    
    if not questions:
        # Mock evaluation
        correct = max(3, len(data.answers) - 1)
        total = len(data.answers)
        score = int((correct / total) * 100)
        passed = score >= 75
        
        level = "Bronze"
        if score >= 95: level = "Platinum"
        elif score >= 85: level = "Gold"
        elif score >= 75: level = "Silver"

        return {
            "quiz_id": data.quiz_id,
            "score": score,
            "correct": correct,
            "total": total,
            "passed": passed,
            "level": level,
            "nft_ready": passed,
            "message": f"{'Congratulations! You passed.' if passed else 'Keep practicing. You can retake the quiz.'} (Mock mode)"
        }

    # Evaluate answers
    correct = 0
    total = len(questions)
    for q in questions:
        user_answer = data.answers.get(q["id"])
        if user_answer and user_answer.upper() == q["correct"].upper():
            correct += 1
    
    score = int((correct / total) * 100) if total > 0 else 0
    passed = score >= 75
    
    level = "Bronze"
    if score >= 95: level = "Platinum"
    elif score >= 85: level = "Gold"
    elif score >= 75: level = "Silver"

    # Update quiz record
    if db:
        db.table("skill_quizzes").update({
            "answers": data.answers,
            "score": score,
            "passed": passed,
            "completed_at": datetime.utcnow().isoformat()
        }).eq("id", data.quiz_id).execute()

    return {
        "quiz_id": data.quiz_id,
        "score": score,
        "correct": correct,
        "total": total,
        "passed": passed,
        "level": level,
        "nft_ready": passed,
        "message": f"{'Congratulations! You passed with a {level} level.' if passed else 'Keep practicing. You need 75% to pass.'}"
    }


@router.get("/history")
async def quiz_history(wallet: str):
    """Get all quiz attempts for a user."""
    db = get_supabase()
    if not db:
        return [
            {"id": "mock-1", "skill_name": "Rust", "score": 88, "passed": True, "difficulty": "intermediate", "completed_at": "2026-04-01T10:00:00"},
            {"id": "mock-2", "skill_name": "Solana", "score": 92, "passed": True, "difficulty": "advanced", "completed_at": "2026-03-28T14:00:00"},
            {"id": "mock-3", "skill_name": "TypeScript", "score": 65, "passed": False, "difficulty": "intermediate", "completed_at": "2026-03-25T09:00:00"},
        ]

    response = db.table("skill_quizzes").select("id, skill_name, score, passed, difficulty, completed_at") \
        .eq("candidate_wallet", wallet) \
        .order("completed_at", desc=True).execute()
    return response.data
