# test_inventory.py - TDD tests for purchase and restock inventory operations.
# These are the core business logic tests.

import pytest


class TestPurchaseVehicle:
    """Tests for POST /api/vehicles/{id}/purchase"""

    def test_purchase_success(self, client, customer_token, sample_vehicle):
        """
        RED: Purchasing a vehicle should decrease its quantity by 1.
        Expected: 200 OK with updated vehicle showing quantity - 1.
        """
        vehicle_id = sample_vehicle["id"]
        original_quantity = sample_vehicle["quantity"]  # = 10

        response = client.post(
            f"/api/vehicles/{vehicle_id}/purchase",
            headers={"Authorization": f"Bearer {customer_token}"}
        )

        assert response.status_code == 200
        assert response.json()["quantity"] == original_quantity - 1

    def test_purchase_decrements_correctly(self, client, customer_token, sample_vehicle):
        """Multiple purchases should decrement quantity each time."""
        vehicle_id = sample_vehicle["id"]

        # Purchase 3 times
        for _ in range(3):
            client.post(
                f"/api/vehicles/{vehicle_id}/purchase",
                headers={"Authorization": f"Bearer {customer_token}"}
            )

        # Check final quantity is 10 - 3 = 7
        response = client.post(
            f"/api/vehicles/{vehicle_id}/purchase",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.json()["quantity"] == 6

    def test_purchase_out_of_stock(self, client, admin_token, customer_token):
        """
        RED: Purchasing a vehicle with quantity=0 should fail with 400 Bad Request
        and a meaningful out-of-stock error message.
        """
        # Create a vehicle with 0 stock
        create_response = client.post("/api/vehicles", json={
            "make": "OutOfStock", "model": "Car", "category": "Sedan",
            "price": 500000, "quantity": 0
        }, headers={"Authorization": f"Bearer {admin_token}"})
        vehicle_id = create_response.json()["id"]

        response = client.post(
            f"/api/vehicles/{vehicle_id}/purchase",
            headers={"Authorization": f"Bearer {customer_token}"}
        )

        assert response.status_code == 400
        assert "stock" in response.json()["detail"].lower()

    def test_purchase_exactly_zero_leaves_empty(self, client, admin_token, customer_token):
        """Purchasing a vehicle with quantity=1 should leave quantity at 0 (not negative)."""
        create_response = client.post("/api/vehicles", json={
            "make": "LastOne", "model": "Car", "category": "Sedan",
            "price": 500000, "quantity": 1
        }, headers={"Authorization": f"Bearer {admin_token}"})
        vehicle_id = create_response.json()["id"]

        response = client.post(
            f"/api/vehicles/{vehicle_id}/purchase",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 200
        assert response.json()["quantity"] == 0

    def test_purchase_nonexistent_vehicle(self, client, customer_token):
        """Purchasing a vehicle that doesn't exist should return 404."""
        response = client.post(
            "/api/vehicles/9999/purchase",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 404

    def test_purchase_requires_auth(self, client, sample_vehicle):
        """Purchasing without a token should fail with 401."""
        vehicle_id = sample_vehicle["id"]
        response = client.post(f"/api/vehicles/{vehicle_id}/purchase")
        assert response.status_code == 401


class TestRestockVehicle:
    """Tests for POST /api/vehicles/{id}/restock"""

    def test_admin_can_restock(self, client, admin_token, sample_vehicle):
        """
        RED: Admin should be able to restock a vehicle, increasing quantity.
        Expected: 200 OK with updated quantity.
        """
        vehicle_id = sample_vehicle["id"]
        original_quantity = sample_vehicle["quantity"]  # = 10

        response = client.post(
            f"/api/vehicles/{vehicle_id}/restock",
            json={"quantity": 5},
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        assert response.json()["quantity"] == original_quantity + 5

    def test_customer_cannot_restock(self, client, customer_token, sample_vehicle):
        """
        RED: A customer should NOT be able to restock vehicles.
        Expected: 403 Forbidden.
        """
        vehicle_id = sample_vehicle["id"]

        response = client.post(
            f"/api/vehicles/{vehicle_id}/restock",
            json={"quantity": 10},
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 403

    def test_restock_nonexistent_vehicle(self, client, admin_token):
        """Restocking a vehicle that doesn't exist should return 404."""
        response = client.post(
            "/api/vehicles/9999/restock",
            json={"quantity": 5},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404

    def test_restock_zero_quantity_rejected(self, client, admin_token, sample_vehicle):
        """Restocking with quantity=0 should be rejected by Pydantic (gt=0 constraint)."""
        vehicle_id = sample_vehicle["id"]
        response = client.post(
            f"/api/vehicles/{vehicle_id}/restock",
            json={"quantity": 0},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 422

    def test_restock_requires_auth(self, client, sample_vehicle):
        """Restocking without a token should fail with 401."""
        vehicle_id = sample_vehicle["id"]
        response = client.post(
            f"/api/vehicles/{vehicle_id}/restock",
            json={"quantity": 5}
        )
        assert response.status_code == 401
