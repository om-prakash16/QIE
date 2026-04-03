from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.ai_routes import router as ai_router
from api.nft_routes import router as nft_router
from api.enhancer_routes import router as enhancer_router
from api.db_routes import router as db_router
from api.admin_routes import router as admin_router
from api.schema_routes import router as schema_router
from api.config_routes import router as config_router

app = FastAPI(
    title="Skillsutra Web3 API",
    description="Backend services for the Decentralized SaaS Job Portal",
    version="1.0.0"
)

# Crucial for local dev bridging Next.js frontend to FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, lock this down!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(nft_router, prefix="/api/v1/nft", tags=["NFT"])
app.include_router(enhancer_router, prefix="/api/v1/enhancer", tags=["Enhancer"])
app.include_router(db_router, prefix="/api/v1/db", tags=["Database"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(schema_router, prefix="/api/v1/schema", tags=["Schema"])
app.include_router(config_router, prefix="/api/v1/config", tags=["Config"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the SkillProof AI API"}

