from fastapi import APIRouter
from portal.apps.auth.routes import router as auth_router
from portal.apps.users.routes import router as users_router
from portal.apps.notifications.routes import router as notifications_router
from portal.apps.matching.routes import router as matching_router
from portal.apps.jobs.routes import router as jobs_router
from portal.apps.applications.routes import router as applications_router
from portal.apps.identities.routes import router as identities_router
from portal.apps.companies.routes import router as companies_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(users_router, prefix="/users", tags=["Users"])
router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
router.include_router(matching_router, prefix="/matching", tags=["Matching"])
router.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
router.include_router(applications_router, prefix="/applications", tags=["Applications"])
router.include_router(identities_router, prefix="/identities", tags=["Identities"])
router.include_router(companies_router, prefix="/companies", tags=["Companies"])
