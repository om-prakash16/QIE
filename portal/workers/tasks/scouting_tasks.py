import asyncio
from portal.apps.matching.controller import MatchingController
from portal.apps.notifications.service import NotificationService
from portal.core.supabase import get_supabase

matching_controller = MatchingController()
notification_service = NotificationService()

async def scout_candidates_for_job(job_id: str, company_id: str):
    """
    Autonomous task to find and suggest candidates for a new job.
    """
    print(f"Autonomous Scouting Agent: Starting search for Job {job_id}")
    
    # 1. Get Match Results
    matches = await matching_controller.find_candidates_for_job(job_id)
    
    # 2. Filter for top matches (> 80%)
    top_matches = [m for m in matches if m["match_score"] >= 80][:5]
    
    if not top_matches:
        print("Scouting Agent: No high-confidence matches found yet.")
        return

    # 3. Store Suggestions (in a real app, we'd have a job_suggestions table)
    # For now, we notify the company.
    db = get_supabase()
    
    # Get company user_id
    company_res = db.table("company_members").select("user_id").eq("company_id", company_id).eq("company_role", "OWNER").single().execute()
    if company_res.data:
        owner_id = company_res.data["user_id"]
        
        # 4. Notify Company
        candidate_names = ", ".join([m["full_name"] for m in top_matches])
        await notification_service.send_notification(
            user_id=owner_id,
            title="AI Scouting Report",
            message=f"Our AI Agent found {len(top_matches)} top candidates for your new role: {candidate_names}.",
            type="scouting_report"
        )
        
        print(f"Scouting Agent: Suggested {len(top_matches)} candidates to Company {company_id}")
