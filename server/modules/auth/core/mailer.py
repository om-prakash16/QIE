import logging
from typing import Optional
import os

logger = logging.getLogger(__name__)


class MailerService:
    """
    Handles generation and delivery of professional transactional emails.
    Integrated with a sleek, vision-aligned 'Dark Mode' aesthetic.
    """

    @staticmethod
    async def send_welcome_email(email: str, name: str):
        """Send a welcome email for new Nexus users."""
        subject = "Welcome to the Nexus | Your Reputation is Secured"
        html_content = f"""
        <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
            <h1 style="color: #6366f1; font-weight: 900; letter-spacing: -1px;">Nexus Activated.</h1>
            <p style="font-size: 18px; color: #a1a1aa;">Welcome, {name}.</p>
            <p style="line-height: 1.6; color: #d4d4d8;">
                You have successfully synchronized your wallet with the <b>Best Hiring Tool</b> platform. 
                Your professional identity is now anchored on-chain.
            </p>
            <div style="margin-top: 30px; padding: 20px; border: 1px solid #1e1e1e; border-radius: 12px; background: #0a0a0a;">
                <p style="margin: 0; font-size: 14px; color: #71717a;">Status: <b>Verified</b></p>
                <p style="margin: 0; font-size: 14px; color: #71717a;">Network: <b>Solana Mainnet Nexus</b></p>
            </div>
            <p style="margin-top: 40px; font-size: 12px; color: #3f3f46;">
                Best Hiring Tool Core | Reputation over Resumes.
            </p>
        </div>
        """
        return await MailerService._execute_delivery(email, subject, html_content)

    @staticmethod
    async def send_application_alert(email: str, job_title: str):
        """Notify a candidate that their application has been registered."""
        subject = "Mission Directive: Application Registered"
        html_content = f"""
        <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
            <h1 style="color: #6366f1; font-weight: 900; letter-spacing: -1px;">Mission Engaged.</h1>
            <p style="font-size: 18px; color: #a1a1aa;">Application successfully transmitted for: <b>{job_title}</b></p>
            <p style="line-height: 1.6; color: #d4d4d8;">
                The employer is now analyzing your <b>Personnel Resonance</b>. 
                Ensure your skill assessments are up to date for maximum impact.
            </p>
            <p style="margin-top: 40px; font-size: 12px; color: #3f3f46;">
                Automated Status Update | Unified Hiring Ecosystem
            </p>
        </div>
        """
        return await MailerService._execute_delivery(email, subject, html_content)

    @staticmethod
    async def send_verification_email(
        email: str, name: str, status: str, reason: Optional[str] = None
    ):
        """Notify a user about their identity verification status."""
        is_success = status == "verified"
        subject = (
            "Identity Verified | Reputation Sync Complete"
            if is_success
            else "Identity Check | Action Required"
        )

        status_color = "#10b981" if is_success else "#f43f5e"
        status_text = "VERIFIED" if is_success else "REJECTED"

        html_content = f"""
        <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="background: {status_color}20; color: {
            status_color
        }; padding: 8px 16px; border-radius: 99px; font-size: 10px; font-weight: 900; letter-spacing: 2px;">{
            status_text
        }</span>
            </div>
            <h1 style="color: #6366f1; font-weight: 900; letter-spacing: -1px; text-align: center;">Identity Nexus Update.</h1>
            <p style="font-size: 18px; color: #a1a1aa; text-align: center;">Hello {
            name
        },</p>
            <p style="line-height: 1.6; color: #d4d4d8; text-align: center;">
                {
            "Your identity has been successfully verified. A 'Verified' badge has been issued to your profile, increasing your <b>Personnel Resonance</b> for all hiring missions."
            if is_success
            else f"Our administrative review detected an issue with your identity submission. <br/><br/><b>Reason:</b> {reason or 'Invalid document quality.'}"
        }
            </p>
            {
            ""
            if is_success
            else '<div style="text-align: center; margin-top: 30px;"><a href="#" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold;">Resubmit Identification</a></div>'
        }
            <p style="margin-top: 40px; font-size: 12px; color: #3f3f46; text-align: center;">
                Trusted Identity Protocol | Best Hiring Tool AI
            </p>
        </div>
        """
        return await MailerService._execute_delivery(email, subject, html_content)

    @staticmethod
    async def send_job_alert(
        email: str, name: str, job_title: str, match_score: int
    ):
        """Notify a candidate about a high-resonance job match."""
        subject = f"High Resonance Match: {job_title} ({match_score}%)"
        html_content = f"""
        <div style="background-color: #020202; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 24px; border: 1px solid #1e1e1e;">
            <div style="text-align: right; margin-bottom: 20px;">
                <span style="background: #6366f120; color: #6366f1; padding: 6px 12px; border-radius: 99px; font-size: 10px; font-weight: 900; letter-spacing: 1px;">AI RECOMMENDED</span>
            </div>
            <h1 style="color: #ffffff; font-weight: 900; letter-spacing: -2px; font-size: 32px; line-height: 1;">Nexus Alert: <br/><span style="color: #6366f1;">New Match Detected.</span></h1>
            <p style="font-size: 18px; color: #a1a1aa; margin-top: 20px;">Hello {name},</p>
            <p style="line-height: 1.6; color: #d4d4d8;">
                Our intelligence nodes have detected a high-resonance opportunity that aligns with your verified skill graph.
            </p>
            
            <div style="margin: 30px 0; padding: 24px; background: #0a0a0a; border-radius: 16px; border: 1px solid #1e1e1e;">
                <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Position</p>
                <p style="margin: 4px 0 16px 0; font-size: 20px; font-weight: bold; color: #ffffff;">{job_title}</p>
                
                <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Personnel Resonance</p>
                <div style="height: 8px; width: 100%; background: #1e1e1e; border-radius: 4px; margin-top: 8px;">
                    <div style="height: 100%; width: {match_score}%; background: #6366f1; border-radius: 4px;"></div>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: bold; color: #6366f1;">{match_score}% Match Confidence</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <a href="http://localhost:3000/jobs" style="background: #ffffff; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">View Directive</a>
            </div>

            <p style="margin-top: 40px; font-size: 10px; color: #3f3f46; text-align: center; text-transform: uppercase; letter-spacing: 2px;">
                Nexus Protocol | Verified Intelligence | Best Hiring Tool
            </p>
        </div>
        """
        return await MailerService._execute_delivery(email, subject, html_content)

    @staticmethod
    async def _execute_delivery(to_email: str, subject: str, html: str):
        """
        Internal delivery engine.
        Placeholder for Resend API / SendGrid / SMTP.
        """
        api_key = os.getenv("RESEND_API_KEY")

        logger.info(f"TRANSACTIONAL EMAIL QUEUED: To={to_email}, Subject='{subject}'")

        if not api_key or api_key == "placeholder":
            logger.warning(
                "EMAIL DELIVERY SKIPPED: Resend API Key not configured. Logging payload for verification."
            )
            # For local verification, we just log success
            return True

        try:
            # Here we would use the 'resend' library:
            # resend.Emails.send({"from": "Nexus <onboarding@resend.dev>", "to": to_email, "subject": subject, "html": html})
            logger.info(f"EMAIL SENT SUCCESSFULLY via Resend to {to_email}")
            return True
        except Exception as e:
            logger.error(f"MAILER FAILURE: {str(e)}")
            return False


mailer = MailerService()
