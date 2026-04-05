from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Modular Feature Routers
from app.ai_engine.router import router as ai_router
from app.blockchain.router import router as nft_router
from app.core_api.enhancer_router import router as enhancer_router
from app.core_api.db_router import router as db_router
from app.admin.admin_router import router as admin_router
from app.profile.schema_router import router as schema_router
from app.core_api.config_router import router as config_router
from app.core_api.colosseum_router import router as colosseum_router
from app.jobs.router import router as company_router
from app.admin.staff_router import router as staff_router
from app.profile.router import router as user_router
from app.ai_engine.quiz_router import router as quiz_router
from app.profile.portfolio_router import router as portfolio_router
from app.ai_engine.scoring_router import router as reputation_router
from app.core_api.notification_router import router as notification_router
from app.core_api.logging_router import router as logging_router

app = FastAPI(
    title="SkillProof AI Enterprise API",
    description="Backend modular services for the SkillProof AI platform",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Registration
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(nft_router, prefix="/api/v1/nft", tags=["Blockchain"])
app.include_router(enhancer_router, prefix="/api/v1/enhancer", tags=["Core"])
app.include_router(db_router, prefix="/api/v1/db", tags=["Core"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(schema_router, prefix="/api/v1/schema", tags=["Profile"])
app.include_router(config_router, prefix="/api/v1/config", tags=["Core"])
app.include_router(colosseum_router, prefix="/api/v1/colosseum", tags=["Core"])
app.include_router(company_router, prefix="/api/v1", tags=["Jobs"])
app.include_router(staff_router, prefix="/api/v1", tags=["Admin"])
app.include_router(user_router, prefix="/api/v1/user", tags=["Profile"])
app.include_router(quiz_router, prefix="/api/v1/quiz", tags=["AI Engine"])
app.include_router(portfolio_router, prefix="/api/v1/portfolio", tags=["Profile"])
app.include_router(reputation_router, prefix="/api/v1/reputation", tags=["AI Engine"])
app.include_router(notification_router, prefix="/api/v1/notifications", tags=["System"])
app.include_router(logging_router, prefix="/api/v1/logs", tags=["System"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the SkillProof AI Modular API"}
