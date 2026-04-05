from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict, Literal
from datetime import datetime

# ──────────────────────────────────────────────────
# RBAC
# ──────────────────────────────────────────────────

StaffRoleId = Literal[
    "support_staff",
    "moderator",
    "verification_staff",
    "recruitment_staff",
    "content_staff",
]

class StaffPermissionGrant(BaseModel):
    staff_wallet: str
    role_id: StaffRoleId
    granted_by: str

class StaffRoleResponse(BaseModel):
    id: str
    label: str
    description: Optional[str]
    permissions: List[str]

class StaffPermissionResponse(BaseModel):
    id: str
    staff_wallet: str
    role_id: str
    granted_by: Optional[str]
    granted_at: Optional[datetime]
    is_active: bool

# ──────────────────────────────────────────────────
# User Reports
# ──────────────────────────────────────────────────

class UserReportCreate(BaseModel):
    reporter_wallet: Optional[str] = None
    reported_wallet: str
    report_type: Literal["fake_profile", "plagiarized_project", "suspicious_activity", "harassment", "other"]
    reason: str
    priority: Literal["low", "normal", "high", "critical"] = "normal"

class UserReportUpdate(BaseModel):
    status: Literal["open", "in_review", "resolved", "dismissed"]
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class UserReportResponse(UserReportCreate):
    id: str
    status: str
    assigned_to: Optional[str]
    resolution_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# ──────────────────────────────────────────────────
# Job Reports
# ──────────────────────────────────────────────────

class JobReportCreate(BaseModel):
    reporter_wallet: Optional[str] = None
    job_id: str
    report_type: Literal["spam", "fake_company", "misleading", "scam", "other"]
    reason: str
    priority: Literal["low", "normal", "high", "critical"] = "normal"

class JobReportUpdate(BaseModel):
    status: Literal["open", "in_review", "resolved", "dismissed"]
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class JobReportResponse(JobReportCreate):
    id: str
    status: str
    assigned_to: Optional[str]
    resolution_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# ──────────────────────────────────────────────────
# Skill Verification Flags
# ──────────────────────────────────────────────────

class SkillFlagCreate(BaseModel):
    nft_mint: str
    candidate_wallet: str
    skill_name: str
    flag_reason: Literal["ai_score_mismatch", "github_suspicious", "duplicate_cert", "invalid_proof", "manual_review"]
    flagged_by: str

class SkillFlagReview(BaseModel):
    status: Literal["approved", "rejected", "retest_requested"]
    reviewed_by: str
    review_notes: Optional[str] = None

class SkillFlagResponse(SkillFlagCreate):
    id: str
    status: str
    reviewed_by: Optional[str]
    review_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# ──────────────────────────────────────────────────
# Support Tickets
# ──────────────────────────────────────────────────

class SupportTicketCreate(BaseModel):
    submitter_wallet: Optional[str] = None
    category: Literal["profile_issue", "wallet_connection", "nft_sync", "job_application", "other"]
    subject: str
    body: str
    priority: Literal["low", "normal", "high", "urgent"] = "normal"

class SupportTicketUpdate(BaseModel):
    status: Literal["open", "in_progress", "resolved", "closed"]
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class SupportTicketResponse(SupportTicketCreate):
    id: str
    status: str
    assigned_to: Optional[str]
    resolution_notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# ──────────────────────────────────────────────────
# Flag User Action
# ──────────────────────────────────────────────────

class FlagUserAction(BaseModel):
    staff_wallet: str
    target_wallet: str
    action: Literal["flag_suspicious", "request_reverification", "suspend", "warn", "send_message"]
    notes: Optional[str] = None

# ──────────────────────────────────────────────────
# Admin Control Models
# ──────────────────────────────────────────────────

class SchemaFieldCreate(BaseModel):
    field_key: str
    label: str
    field_type: Literal["text", "number", "select", "multi-select", "checkbox"]
    required: bool = False
    display_order: int = 0
    validation_rules: Optional[Dict[str, Any]] = {}

class AIConfigRequest(BaseModel):
    weights: Dict[str, float]
    thresholds: Dict[str, Any]

class FeatureToggleRequest(BaseModel):
    feature_key: str
    is_enabled: bool

class AnalyticsStatsResponse(BaseModel):
    total_users: int
    total_jobs: int
    total_nfts_minted: int
    platform_health: str
    last_calc_at: Optional[datetime]

# ──────────────────────────────────────────────────
# Staff Operational Models
# ──────────────────────────────────────────────────

class StaffAuditLogResponse(BaseModel):
    id: str
    staff_wallet: str
    action: str
    target_type: str
    target_id: str
    metadata: Dict[str, Any]
    created_at: datetime

class NFTActivityLog(BaseModel):
    nft_mint: str
    owner_wallet: str
    event_type: Literal["mint", "update", "burn", "transfer"]
    metadata_cid: str
    timestamp: datetime
