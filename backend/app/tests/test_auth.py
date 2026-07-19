# test_auth.py - TDD tests for authentication endpoints.
# These tests cover registration, login, duplicate checks, and token validation.
# Written BEFORE implementing the auth logic (Red → Green → Refactor).

import pytest


class TestUserRegistration:
    """Tests for POST /api/auth/register"""

    def test_register_success(self, client):
        """
        RED: A new user with valid data should be registered successfully.
        Expected: 201 Created with user data returned (no password in response).
        """
        response = client.post("/api/auth/register", json={
            "username": "johndoe",
            "email": "john@example.com",
            "password": "securepass123"
        })

        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "johndoe"
        assert data["email"] == "john@example.com"
        assert data["role"] == "customer"  # Default role
        assert "id" in data
        assert "password" not in data  # Never expose password in response
        assert "password_hash" not in data

    def test_register_admin_user(self, client):
        """Registering with role=admin should create an admin account."""
        response = client.post("/api/auth/register", json={
            "username": "adminuser",
            "email": "admin@example.com",
            "password": "adminpass123",
            "role": "admin"
        })
        assert response.status_code == 201
        assert response.json()["role"] == "admin"

    def test_register_duplicate_username(self, client):
        """
        RED: Registering with an already-taken username should fail.
        Expected: 400 Bad Request.
        """
        # First registration — should succeed
        client.post("/api/auth/register", json={
            "username": "sameuser",
            "email": "first@example.com",
            "password": "password123"
        })

        # Second registration with same username — should fail
        response = client.post("/api/auth/register", json={
            "username": "sameuser",
            "email": "second@example.com",
            "password": "password456"
        })

        assert response.status_code == 400
        assert "username" in response.json()["detail"].lower()

    def test_register_duplicate_email(self, client):
        """Registering with an already-used email should fail with 400."""
        client.post("/api/auth/register", json={
            "username": "firstuser",
            "email": "shared@example.com",
            "password": "password123"
        })

        response = client.post("/api/auth/register", json={
            "username": "seconduser",
            "email": "shared@example.com",
            "password": "password456"
        })

        assert response.status_code == 400
        assert "email" in response.json()["detail"].lower()

    def test_register_short_password(self, client):
        """A password shorter than 6 characters should be rejected by Pydantic validation."""
        response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "123"  # Too short
        })
        assert response.status_code == 422  # Unprocessable Entity

    def test_register_missing_fields(self, client):
        """Missing required fields should return 422 Unprocessable Entity."""
        response = client.post("/api/auth/register", json={
            "username": "incomplete"
            # Missing email and password
        })
        assert response.status_code == 422

    def test_register_invalid_email(self, client):
        """An invalid email format should be rejected."""
        response = client.post("/api/auth/register", json={
            "username": "testuser",
            "email": "not-a-valid-email",
            "password": "password123"
        })
        assert response.status_code == 422


class TestUserLogin:
    """Tests for POST /api/auth/login"""

    def test_login_success(self, client):
        """
        RED: A registered user should be able to log in and receive a JWT token.
        Expected: 200 OK with access_token, token_type, and user info.
        """
        # Register first
        client.post("/api/auth/register", json={
            "username": "logintest",
            "email": "logintest@example.com",
            "password": "mypassword123"
        })

        # Now log in
        response = client.post("/api/auth/login", json={
            "username": "logintest",
            "password": "mypassword123"
        })

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["username"] == "logintest"

    def test_login_wrong_password(self, client):
        """
        RED: Logging in with the wrong password should fail.
        Expected: 401 Unauthorized.
        """
        client.post("/api/auth/register", json={
            "username": "wrongpass_user",
            "email": "wrongpass@example.com",
            "password": "correctpassword"
        })

        response = client.post("/api/auth/login", json={
            "username": "wrongpass_user",
            "password": "wrongpassword"
        })

        assert response.status_code == 401

    def test_login_nonexistent_user(self, client):
        """Logging in with a username that doesn't exist should return 401."""
        response = client.post("/api/auth/login", json={
            "username": "ghost_user",
            "password": "doesntmatter"
        })
        assert response.status_code == 401

    def test_token_is_usable(self, client):
        """A token returned from login should work to access protected endpoints."""
        client.post("/api/auth/register", json={
            "username": "tokentest",
            "email": "tokentest@example.com",
            "password": "tokenpass123"
        })
        login_resp = client.post("/api/auth/login", json={
            "username": "tokentest",
            "password": "tokenpass123"
        })
        token = login_resp.json()["access_token"]

        # Use the token to access a protected route
        vehicles_resp = client.get(
            "/api/vehicles",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert vehicles_resp.status_code == 200

    def test_access_protected_route_without_token(self, client):
        """Accessing a protected endpoint without a token should return 401."""
        response = client.get("/api/vehicles")  # No Authorization header
        assert response.status_code == 401

    def test_access_protected_route_with_invalid_token(self, client):
        """Using a fake/invalid token should return 401."""
        response = client.get(
            "/api/vehicles",
            headers={"Authorization": "Bearer this.is.a.fake.token"}
        )
        assert response.status_code == 401
