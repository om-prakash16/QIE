from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
from modules.auth.handlers import initialize_event_handlers

app = FastAPI(
    title="Best Hiring Tool",
    description="Full-stack, enterprise-grade hiring platform with AI matching and verifiable credentials.",
    version="3.1.0",
)

@app.on_event("startup")
async def startup_event():
    # Initialize system-wide event handlers (Mailer, Analytics, etc.)
    initialize_event_handlers()

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
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(company_router, prefix="/api/v1/company", tags=["Company"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["Jobs"])
app.include_router(applications_router, prefix="/api/v1/applications", tags=["Applications"])
app.include_router(nft_router, prefix="/api/v1/nft", tags=["NFT"])
app.include_router(search_router, prefix="/api/v1/search", tags=["Search"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(activity_router, prefix="/api/v1/activity", tags=["Activity"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(sync_router, prefix="/api/v1/sync", tags=["Sync"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(cms_router, prefix="/api/v1/cms", tags=["CMS"])
app.include_router(career_router, prefix="/api/v1/career", tags=["Career Planning"])
app.include_router(identity_router, prefix="/api/v1", tags=["Networking & Identity"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Community Chat"])
app.include_router(enterprise_router, prefix="/api/v1/enterprise", tags=["Enterprise API"])


@app.get("/")
def health():
    return {
        "status": "online",
        "platform": "Best Hiring Tool",
        "version": "3.1.0",
        "docs": "/docs",
    }
