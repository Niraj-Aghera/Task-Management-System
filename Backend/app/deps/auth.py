from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.core.config import settings
from app.services.user import UserService
from app.deps.db import DBSession

ALGORITHM = "HS256"
security = HTTPBearer()  # For Bearer token auth

async def get_current_user(
    db: DBSession,  # DB first (non-default)
    token: HTTPAuthorizationCredentials = Depends(security),  # Depends after
):
    try:
        payload = jwt.decode(token.credentials, settings.jwt_secret_key, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    service = UserService(db)
    user = await service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
