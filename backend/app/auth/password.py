# password.py - Handles all password hashing and verification using passlib + bcrypt
# We keep this isolated so we can easily swap the hashing algorithm later if needed.

from passlib.context import CryptContext

# Use bcrypt as the hashing algorithm - it is slow by design, making brute force attacks harder.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    The result is a salted hash, so two calls with the same password produce different hashes.
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compare a plain-text password against a stored bcrypt hash.
    Returns True if they match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)
