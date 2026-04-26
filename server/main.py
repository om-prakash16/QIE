from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from modules.auth.router import router as auth_router
from modules.users.router import router as users_router
from modules.ai.router import router as ai_router
from modules.company.router import router as company_router
from modules.jobs.router import router as jobs_router
from modules.applications.router import router as applications_router
from modules.nft.router import router as nft_router
from modules.search.router import router as search_router
from modules.notifications.router import router as notifications_router
from modules.activity.router import router as activity_router
from modules.analytics.router import router as analytics_router
from modules.sync.router import router as sync_router
from modules.admin.router import router as admin_router
from modules.cms.router import router as cms_router
from modules.career.router import router as career_router
from modules.users.identity_router import router as identity_router
from modules.chat.router import router as chat_router
from modules.enterprise.router import router as enterprise_router
from modules.skill_graph.router import router as skill_graph_router
from modules.projects.router import router as projects_router
from modules.auth.handlers import initialize_event_handlers

# Configure standard logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("best_hiring")

app = FastAPI(
    title="Best Hiring Tool Protocol",
    description="Full-stack, enterprise-grade verification engine and talent network.",
    version="4.0.0",
    default_response_class=ORJSONResponse,
)


@app.on_event("startup")
async def startup_event():
    # Initialize system-wide event handlers (Mailer, Analytics, etc.)
    logger.info("Initializing Best Hiring Protocol Core...")
    initialize_event_handlers()


# Global Exception Handlers (SaaS Standard)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "code": exc.status_code, "message": str(exc.detail)},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"status": "error", "code": 422, "message": "Validation Error", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "code": 500, "message": "Internal Server Error"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/v1/profile", tags=["Profile"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(company_router, prefix="/api/v1/company", tags=["Company Network"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["Jobs Market"])
app.include_router(
    applications_router, prefix="/api/v1/applications", tags=["Applications"]
)
app.include_router(nft_router, prefix="/api/v1/nft", tags=["NFT Ledgers"])
app.include_router(search_router, prefix="/api/v1/search", tags=["Global Search"])
app.include_router(
    notifications_router, prefix="/api/v1/notifications", tags=["Notifications"]
)
app.include_router(activity_router, prefix="/api/v1/activity", tags=["Audit Log"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Heuristics"])
app.include_router(sync_router, prefix="/api/v1/sync", tags=["State Sync"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin Override"])
app.include_router(cms_router, prefix="/api/v1/cms", tags=["CMS Delivery"])
app.include_router(career_router, prefix="/api/v1/career", tags=["Career Modeling"])
app.include_router(identity_router, prefix="/api/v1", tags=["Cryptographic Identity"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Comm-Link"])
app.include_router(
    enterprise_router, prefix="/api/v1/enterprise", tags=["Enterprise Protocol"]
)
app.include_router(
    skill_graph_router, prefix="/api/v1/skills", tags=["Skill Graph Mesh"]
)
app.include_router(
    projects_router, prefix="/api/v1/projects", tags=["Proof of Work"]
)


@app.get("/")
def health():
    return {
        "status": "online",
        "platform": "Best Hiring Tool Protocol Core",
        "version": "4.0.0",
        "docs": "/docs",
    }
