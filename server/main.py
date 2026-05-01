import logging
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import ORJSONResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware

from core.exceptions import AppException
from core.response import error_response

from modules.auth.api.router import router as auth_router
from modules.users.api.router import router as users_router
from modules.ai.router import router as ai_router
from modules.company.api.router import router as company_router
from modules.jobs.router import router as jobs_router
from modules.applications.router import router as applications_router
from modules.nft.router import router as nft_router
from modules.search.router import router as search_router
from modules.notifications.api.router import router as notifications_router
from modules.activity.router import router as activity_router
from modules.analytics.router import router as analytics_router
from modules.sync.router import router as sync_router
from modules.admin.api.router import router as admin_router
from modules.cms.router import router as cms_router
from modules.career.router import router as career_router
from modules.users.api.identity_router import router as identity_router
from modules.users.api.settings_router import router as settings_router
from modules.chat.router import router as chat_router
from modules.enterprise.router import router as enterprise_router
from modules.skill_graph.router import router as skill_graph_router
from modules.projects.router import router as projects_router
from modules.talent_pool.router import router as talent_pool_router
from modules.competitions.router import router as competitions_router
from modules.auth.core.handlers import initialize_event_handlers

# Configure standard logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("best_hiring")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize system-wide event handlers (Mailer, Analytics, etc.)
    logger.info("Initializing Best Hiring Protocol Core...")
    initialize_event_handlers()
    yield
    logger.info("Shutting down Best Hiring Protocol Core...")

app = FastAPI(
    title="Best Hiring Tool Protocol",
    description="Full-stack, enterprise-grade verification engine and talent network.",
    version="4.0.0",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)


# (Lifespan handles startup now)


# Global Exception Handlers (SaaS Standard)
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return error_response(
        message=exc.message,
        code=exc.code,
        details=exc.details,
        status_code=exc.status_code
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return error_response(
        message=str(exc.detail),
        code="http_error",
        status_code=exc.status_code
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return error_response(
        message="Validation Error",
        code="validation_error",
        details=exc.errors(),
        status_code=422
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Unhandled Exception [ID: {request_id}] on {request.method} {request.url}: {str(exc)}", exc_info=True)
    return error_response(
        message="Internal Server Error",
        code="internal_error",
        details={"request_id": request_id} if logging.getLogger().getEffectiveLevel() <= logging.DEBUG else None,
        status_code=500
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
app.include_router(
    talent_pool_router, prefix="/api/v1/talent-pool", tags=["Talent Pool"]
)
app.include_router(
    competitions_router, prefix="/api/v1/competitions", tags=["Competitions"]
)
app.include_router(
    settings_router, prefix="/api/v1/profile/settings", tags=["User Settings"]
)


@app.get("/")
def health():
    return {
        "status": "online",
        "platform": "Best Hiring Tool Protocol Core",
        "version": "4.0.0",
        "docs": "/docs",
    }
