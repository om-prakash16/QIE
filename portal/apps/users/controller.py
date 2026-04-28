from portal.apps.users.service import UserService
from fastapi import HTTPException

class UserController:
    def __init__(self):
        self.service = UserService()

    async def get_my_profile(self, user_id: str):
        profile = await self.service.get_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile

    async def get_portfolio(self, user_code: str):
        portfolio = await self.service.get_public_portfolio(user_code)
        if not portfolio:
            raise HTTPException(status_code=404, detail="Portfolio not found or private")
        return portfolio

    async def update_profile(self, user_id: str, data: dict):
        return await self.service.update_profile(user_id, data)
