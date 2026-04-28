import os
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY") # Or SendGrid/AWS SES
        self.from_email = os.getenv("FROM_EMAIL", "onboarding@skillsutra.ai")

    async def send_email(self, to: str, subject: str, body: str):
        """
        Send a transactional email. 
        Currently implemented as a robust logging stub for MVP.
        """
        logger.info(f"EMAIL_OUT: To={to} Subject={subject}")
        
        if not self.api_key:
            logger.warning("Email API key missing. Email not sent via provider.")
            return False
            
        # Implementation for Resend/SendGrid would go here
        return True
