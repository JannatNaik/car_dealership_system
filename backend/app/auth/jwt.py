# jwt.py - Handles creating and decoding JSON Web Tokens for authentication.
# We use python-jose for JWT operations.

from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.schemas.user import TokenData

# Secret key used to sign tokens. In production, store this in an environment variable!
SECRET_KEY = "car_dealership_super_secret_key_change_in_production"
ALGORITHM = "HS256"
# Token will expire after 24 hours by default
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: A dictionary of claims to encode (e.g., {"sub": username, "role": "admin"}).
        expires_delta: Optional custom expiry time. Defaults to 24 hours.

    Returns:
        A signed JWT string.
    """
    to_encode = data.copy()

    # Set the expiry time
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[TokenData]:
    """
    Decode a JWT token and extract the user's identity.

    Args:
        token: The raw JWT string from the Authorization header.

    Returns:
        A TokenData object with username and role, or None if the token is invalid/expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")

        if username is None:
            return None

        return TokenData(username=username, role=role)

    except JWTError:
        # Token is invalid, expired, or tampered with
        return None
