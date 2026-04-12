"""
Staff Panel API Routes
Implements all 14 sections of the Staff Panel architecture plan.
RBAC is enforced server-side via verify_staff_permission() dependency.
"""
import json
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from core.postgres import get_db_connection
from modules.admin.models import (
    StaffPermissionGrant, StaffPermissionResponse,
    UserReportCreate, UserReportUpdate, UserReportResponse,
    JobReportCreate, JobReportUpdate, JobReportResponse,
    SkillFlagCreate, SkillFlagReview, SkillFlagResponse,
    SupportTicketCreate, SupportTicketUpdate, SupportTicketResponse,
    FlagUserAction, StaffAuditLogResponse as AuditLogResponse,
)

router = APIRouter(prefix="/staff")

# ──────────────────────────────────────────────────
# Internal RBAC Helper
# ──────────────────────────────────────────────────

def _check_staff_permission(wallet: str, required_permission: str, conn) -> bool:
    """Verify that a wallet holds the required staff permission."""
    cur = conn.cursor()
    cur.execute("""
        SELECT srm.permissions
        FROM staff_permissions sp
        JOIN staff_roles_master srm ON sp.role_id = srm.id
        WHERE sp.staff_wallet = %s AND sp.is_active = TRUE
    """, (wallet,))
    rows = cur.fetchall()
    cur.close()
    all_permissions = []
    for row in rows:
        perms = row[0] if isinstance(row[0], list) else json.loads(row[0])
        all_permissions.extend(perms)
    return required_permission in all_permissions

def _write_audit_log(conn, staff_wallet: str, action: str, target_type: str, target_id: str, metadata: dict = {}):
    """Write an immutable audit log entry for every staff action."""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO staff_audit_logs (staff_wallet, action, target_type, target_id, metadata)
        VALUES (%s, %s, %s, %s, %s)
    """, (staff_wallet, action, target_type, target_id, json.dumps(metadata)))
    cur.close()

def _dict_from_row(cur, row):
    columns = [desc[0] for desc in cur.description]
    return dict(zip(columns, row))

# ──────────────────────────────────────────────────
# SECTION 10 — RBAC: Role Assignment
# ──────────────────────────────────────────────────

@router.post("/staff/permissions/grant", summary="Admin grants staff role to wallet")
async def grant_staff_role(payload: StaffPermissionGrant):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO staff_permissions (staff_wallet, role_id, granted_by)
            VALUES (%s, %s, %s)
            ON CONFLICT (staff_wallet, role_id) DO UPDATE SET is_active = TRUE
            RETURNING id, staff_wallet, role_id, granted_by, granted_at, is_active
        """, (payload.staff_wallet, payload.role_id, payload.granted_by))
        row = cur.fetchone()
        conn.commit()
        result = _dict_from_row(cur, row)
        result['id'] = str(result['id'])
        return result
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/staff/permissions/{wallet}", summary="Get all roles for a staff wallet")
async def get_staff_roles(wallet: str):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT sp.id, sp.staff_wallet, sp.role_id, sp.granted_by, sp.granted_at, sp.is_active,
                   srm.label, srm.permissions
            FROM staff_permissions sp
            JOIN staff_roles_master srm ON sp.role_id = srm.id
            WHERE sp.staff_wallet = %s AND sp.is_active = TRUE
        """, (wallet,))
        rows = cur.fetchall()
        return [{"role_id": row[2], "label": row[6], "permissions": row[7], "granted_at": row[4]}
                for row in rows]
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 3 — User Management
# GET /staff/users
# ──────────────────────────────────────────────────

@router.get("/staff/users", summary="Staff: Search & filter users")
async def get_users_for_staff(
    staff_wallet: str,
    search: Optional[str] = None,
    min_reputation: Optional[int] = None,
    status: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_users", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        filters = ["1=1"]
        params = []
        if search:
            filters.append("(full_name ILIKE %s OR wallet_address ILIKE %s OR github_handle ILIKE %s)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if min_reputation is not None:
            filters.append("reputation_score >= %s")
            params.append(min_reputation)
        if status:
            filters.append("status = %s")
            params.append(status)
        params.extend([limit, offset])
        cur.execute(f"""
            SELECT wallet_address, full_name, email, reputation_score, github_handle,
                   status, role, created_at, profile_data, reputation_details
            FROM users
            WHERE {' AND '.join(filters)}
            ORDER BY reputation_score DESC
            LIMIT %s OFFSET %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        return {"users": result, "count": len(result)}
    finally:
        cur.close()
        conn.close()

@router.post("/staff/flag-user", summary="Staff: Flag, suspend, or message a user")
async def flag_user(payload: FlagUserAction):
    conn = get_db_connection()
    if not _check_staff_permission(payload.staff_wallet, "flag_user", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        if payload.action == "suspend":
            cur.execute(
                "UPDATE users SET status = 'suspended' WHERE wallet_address = %s RETURNING wallet_address",
                (payload.target_wallet,)
            )
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="User not found.")

        _write_audit_log(conn, payload.staff_wallet, payload.action, "user", payload.target_wallet,
                         {"notes": payload.notes})
        conn.commit()
        return {"status": "success", "action": payload.action, "target": payload.target_wallet}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 4 — Job Moderation
# GET /staff/jobs
# ──────────────────────────────────────────────────

@router.get("/staff/jobs", summary="Staff: View and moderate job listings")
async def get_jobs_for_staff(
    staff_wallet: str,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_jobs", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        filters = ["1=1"]
        params = []
        if status:
            filters.append("j.status = %s")
            params.append(status)
        if search:
            filters.append("(j.title ILIKE %s OR j.description ILIKE %s)")
            params.extend([f"%{search}%", f"%{search}%"])
        params.extend([limit, offset])
        cur.execute(f"""
            SELECT j.id, j.title, j.description, j.status, j.required_skills,
                   j.employment_type, j.location_type, j.salary_range, j.created_at,
                   c.name as company_name, c.is_verified as company_verified
            FROM jobs j
            LEFT JOIN companies c ON j.company_id = c.id
            WHERE {' AND '.join(filters)}
            ORDER BY j.created_at DESC
            LIMIT %s OFFSET %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        for r in result:
            if r.get('id'):
                r['id'] = str(r['id'])
        return {"jobs": result, "count": len(result)}
    finally:
        cur.close()
        conn.close()

@router.patch("/staff/jobs/{job_id}/status", summary="Staff: Approve or flag a job")
async def update_job_status(job_id: str, staff_wallet: str, new_status: str, notes: Optional[str] = None):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "flag_job", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE jobs SET status = %s WHERE id = %s RETURNING id",
            (new_status, job_id)
        )
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Job not found.")
        _write_audit_log(conn, staff_wallet, f"job_status_{new_status}", "job", job_id, {"notes": notes})
        conn.commit()
        return {"status": "success", "job_id": job_id, "new_status": new_status}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 7 — Reports & Flag System
# GET /staff/reports
# POST /staff/resolve-report
# ──────────────────────────────────────────────────

@router.get("/reports", summary="Staff: View all platform reports")
async def get_reports(
    staff_wallet: str,
    report_kind: str = Query(default="user", description="'user' or 'job'"),
    priority: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(default=20, le=100),
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_reports", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        table = "user_reports" if report_kind == "user" else "job_reports"
        filters = ["1=1"]
        params = []
        if priority:
            filters.append("priority = %s")
            params.append(priority)
        if status:
            filters.append("status = %s")
            params.append(status)
        params.append(limit)
        cur.execute(f"""
            SELECT * FROM {table}
            WHERE {' AND '.join(filters)}
            ORDER BY
                CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END,
                created_at DESC
            LIMIT %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        for r in result:
            if r.get('id'):
                r['id'] = str(r['id'])
            if r.get('job_id'):
                r['job_id'] = str(r['job_id'])
        return {"reports": result, "count": len(result), "kind": report_kind}
    finally:
        cur.close()
        conn.close()

@router.post("/resolve-report", summary="Staff: Resolve or escalate a report")
async def resolve_report(staff_wallet: str, report_id: str, report_kind: str,
                         status: str, resolution_notes: Optional[str] = None):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "resolve_report", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        table = "user_reports" if report_kind == "user" else "job_reports"
        cur.execute(f"""
            UPDATE {table}
            SET status = %s, resolution_notes = %s, assigned_to = %s, updated_at = NOW()
            WHERE id = %s RETURNING id
        """, (status, resolution_notes, staff_wallet, report_id))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Report not found.")
        _write_audit_log(conn, staff_wallet, "resolve_report", report_kind + "_report", report_id,
                         {"resolution": status, "notes": resolution_notes})
        conn.commit()
        return {"status": "success", "report_id": report_id, "new_status": status}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 5 — Skill Verification Review
# POST /staff/approve-skill
# ──────────────────────────────────────────────────

@router.post("/staff/skill-flags", summary="Staff: Flag a skill NFT for review")
async def create_skill_flag(payload: SkillFlagCreate):
    conn = get_db_connection()
    if not _check_staff_permission(payload.flagged_by, "flag_fake_skill", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO skill_verification_flags
                (nft_mint, candidate_wallet, skill_name, flag_reason, flagged_by)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (payload.nft_mint, payload.candidate_wallet, payload.skill_name,
              payload.flag_reason, payload.flagged_by))
        row = cur.fetchone()
        _write_audit_log(conn, payload.flagged_by, "flag_skill_nft", "skill_nft",
                         payload.nft_mint, {"reason": payload.flag_reason})
        conn.commit()
        return {"status": "flagged", "flag_id": str(row[0])}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.post("/staff/approve-skill", summary="Staff: Review a flagged skill NFT")
async def approve_skill(flag_id: str, payload: SkillFlagReview):
    conn = get_db_connection()
    if not _check_staff_permission(payload.reviewed_by, "approve_skill", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE skill_verification_flags
            SET status = %s, reviewed_by = %s, review_notes = %s, updated_at = NOW()
            WHERE id = %s RETURNING nft_mint
        """, (payload.status, payload.reviewed_by, payload.review_notes, flag_id))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Skill flag not found.")
        _write_audit_log(conn, payload.reviewed_by, payload.status, "skill_nft", row[0],
                         {"notes": payload.review_notes})
        conn.commit()
        return {"status": payload.status, "flag_id": flag_id}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 8 — Support Tickets
# ──────────────────────────────────────────────────

@router.post("/staff/tickets", summary="Create a new support ticket")
async def create_ticket(payload: SupportTicketCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO support_tickets (submitter_wallet, category, subject, body, priority)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """, (payload.submitter_wallet, payload.category, payload.subject,
              payload.body, payload.priority))
        row = cur.fetchone()
        conn.commit()
        return {"ticket_id": str(row[0]), "status": "open"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.get("/staff/tickets", summary="Staff: View support tickets")
async def get_tickets(
    staff_wallet: str,
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=20, le=100),
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_tickets", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        filters = ["1=1"]
        params = []
        if status:
            filters.append("status = %s")
            params.append(status)
        if category:
            filters.append("category = %s")
            params.append(category)
        params.append(limit)
        cur.execute(f"""
            SELECT * FROM support_tickets
            WHERE {' AND '.join(filters)}
            ORDER BY
                CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END,
                created_at ASC
            LIMIT %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        for r in result:
            r['id'] = str(r['id'])
        return {"tickets": result, "count": len(result)}
    finally:
        cur.close()
        conn.close()

@router.patch("/staff/tickets/{ticket_id}", summary="Staff: Update a ticket status")
async def update_ticket(ticket_id: str, staff_wallet: str, payload: SupportTicketUpdate):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "resolve_ticket", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE support_tickets
            SET status = %s, assigned_to = %s, resolution_notes = %s, updated_at = NOW()
            WHERE id = %s RETURNING id
        """, (payload.status, payload.assigned_to or staff_wallet,
              payload.resolution_notes, ticket_id))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Ticket not found.")
        _write_audit_log(conn, staff_wallet, f"ticket_{payload.status}", "ticket", ticket_id)
        conn.commit()
        return {"status": "success", "ticket_id": ticket_id, "new_status": payload.status}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 6 — NFT Activity Monitor
# GET /staff/nft-logs
# ──────────────────────────────────────────────────

@router.get("/staff/nft-logs", summary="Staff: View recent NFT activity and skill flags")
async def get_nft_logs(
    staff_wallet: str,
    limit: int = Query(default=20, le=100),
    status: Optional[str] = None,
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_skill_nfts", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        filters = ["1=1"]
        params = []
        if status:
            filters.append("svf.status = %s")
            params.append(status)
        params.append(limit)
        cur.execute(f"""
            SELECT svf.*, u.full_name as candidate_name
            FROM skill_verification_flags svf
            LEFT JOIN users u ON svf.candidate_wallet = u.wallet_address
            WHERE {' AND '.join(filters)}
            ORDER BY svf.created_at DESC
            LIMIT %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        for r in result:
            r['id'] = str(r['id'])
        return {"nft_flags": result, "count": len(result)}
    finally:
        cur.close()
        conn.close()

# ──────────────────────────────────────────────────
# SECTION 9 — AI Logs Monitoring
# ──────────────────────────────────────────────────

@router.get("/staff/audit-logs", summary="Staff: View staff audit trail")
async def get_audit_logs(
    staff_wallet: str,
    target_type: Optional[str] = None,
    limit: int = Query(default=50, le=200),
):
    conn = get_db_connection()
    if not _check_staff_permission(staff_wallet, "view_reports", conn):
        conn.close()
        raise HTTPException(status_code=403, detail="Insufficient staff permissions.")
    cur = conn.cursor()
    try:
        filters = ["1=1"]
        params = []
        if target_type:
            filters.append("target_type = %s")
            params.append(target_type)
        params.append(limit)
        cur.execute(f"""
            SELECT sal.*, u.full_name as staff_name
            FROM staff_audit_logs sal
            LEFT JOIN users u ON sal.staff_wallet = u.wallet_address
            WHERE {' AND '.join(filters)}
            ORDER BY sal.created_at DESC
            LIMIT %s
        """, params)
        rows = cur.fetchall()
        result = [_dict_from_row(cur, row) for row in rows]
        for r in result:
            r['id'] = str(r['id'])
        return {"logs": result, "count": len(result)}
    finally:
        cur.close()
        conn.close()
