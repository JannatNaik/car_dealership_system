# test_vehicles.py - TDD tests for vehicle CRUD endpoints.
# Tests cover adding, listing, searching, updating, and deleting vehicles,
# as well as role-based access control (admin vs customer).

import pytest


class TestGetVehicles:
    """Tests for GET /api/vehicles"""

    def test_list_vehicles_empty(self, client, customer_token):
        """Initially, the inventory should be empty."""
        response = client.get(
            "/api/vehicles",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 200
        assert response.json() == []

    def test_list_vehicles_returns_all(self, client, admin_token, customer_token):
        """After adding vehicles, GET /api/vehicles should return all of them."""
        # Add two vehicles as admin
        for make in ["Toyota", "Honda"]:
            client.post("/api/vehicles", json={
                "make": make, "model": "Test", "category": "Sedan",
                "price": 1000000, "quantity": 5
            }, headers={"Authorization": f"Bearer {admin_token}"})

        response = client.get(
            "/api/vehicles",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 200
        assert len(response.json()) == 2


class TestCreateVehicle:
    """Tests for POST /api/vehicles"""

    def test_admin_can_add_vehicle(self, client, admin_token):
        """
        RED: An admin should be able to add a new vehicle.
        Expected: 201 Created with vehicle data.
        """
        response = client.post("/api/vehicles", json={
            "make": "Toyota",
            "model": "Fortuner",
            "category": "SUV",
            "price": 4200000.00,
            "quantity": 10
        }, headers={"Authorization": f"Bearer {admin_token}"})

        assert response.status_code == 201
        data = response.json()
        assert data["make"] == "Toyota"
        assert data["model"] == "Fortuner"
        assert data["category"] == "SUV"
        assert data["price"] == 4200000.00
        assert data["quantity"] == 10
        assert "id" in data

    def test_customer_cannot_add_vehicle(self, client, customer_token):
        """
        RED: A customer should NOT be able to add vehicles.
        Expected: 403 Forbidden.
        """
        response = client.post("/api/vehicles", json={
            "make": "Honda",
            "model": "City",
            "category": "Sedan",
            "price": 800000,
            "quantity": 3
        }, headers={"Authorization": f"Bearer {customer_token}"})

        assert response.status_code == 403

    def test_add_vehicle_negative_price_rejected(self, client, admin_token):
        """Pydantic validation should reject negative prices."""
        response = client.post("/api/vehicles", json={
            "make": "Test", "model": "Car", "category": "Sedan",
            "price": -5000, "quantity": 1
        }, headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 422

    def test_add_vehicle_negative_quantity_rejected(self, client, admin_token):
        """Pydantic validation should reject negative quantities."""
        response = client.post("/api/vehicles", json={
            "make": "Test", "model": "Car", "category": "Sedan",
            "price": 5000, "quantity": -1
        }, headers={"Authorization": f"Bearer {admin_token}"})
        assert response.status_code == 422


class TestUpdateVehicle:
    """Tests for PUT /api/vehicles/{id}"""

    def test_admin_can_update_vehicle(self, client, admin_token, sample_vehicle):
        """Admin should be able to update vehicle fields."""
        vehicle_id = sample_vehicle["id"]

        response = client.put(
            f"/api/vehicles/{vehicle_id}",
            json={"price": 5000000.00, "quantity": 15},
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["price"] == 5000000.00
        assert data["quantity"] == 15
        assert data["make"] == "Toyota"  # Unchanged field stays the same

    def test_customer_cannot_update_vehicle(self, client, customer_token, sample_vehicle):
        """Customer should NOT be able to update vehicles. Expected: 403."""
        vehicle_id = sample_vehicle["id"]
        response = client.put(
            f"/api/vehicles/{vehicle_id}",
            json={"price": 1000},
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 403

    def test_update_nonexistent_vehicle(self, client, admin_token):
        """Updating a vehicle that doesn't exist should return 404."""
        response = client.put(
            "/api/vehicles/9999",
            json={"price": 1000},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404


class TestDeleteVehicle:
    """Tests for DELETE /api/vehicles/{id}"""

    def test_admin_can_delete_vehicle(self, client, admin_token, sample_vehicle):
        """Admin should be able to delete a vehicle."""
        vehicle_id = sample_vehicle["id"]

        response = client.delete(
            f"/api/vehicles/{vehicle_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200

        # Verify it is actually gone
        get_response = client.get(
            "/api/vehicles",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert all(v["id"] != vehicle_id for v in get_response.json())

    def test_customer_cannot_delete_vehicle(self, client, customer_token, sample_vehicle):
        """Customer should NOT be able to delete vehicles. Expected: 403."""
        vehicle_id = sample_vehicle["id"]
        response = client.delete(
            f"/api/vehicles/{vehicle_id}",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 403

    def test_delete_nonexistent_vehicle(self, client, admin_token):
        """Deleting a vehicle that doesn't exist should return 404."""
        response = client.delete(
            "/api/vehicles/9999",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 404


class TestSearchVehicles:
    """Tests for GET /api/vehicles/search"""

    def test_search_by_make(self, client, admin_token, customer_token):
        """Searching by make should return only matching vehicles."""
        client.post("/api/vehicles", json={
            "make": "Toyota", "model": "Fortuner", "category": "SUV",
            "price": 4200000, "quantity": 5
        }, headers={"Authorization": f"Bearer {admin_token}"})
        client.post("/api/vehicles", json={
            "make": "Honda", "model": "City", "category": "Sedan",
            "price": 900000, "quantity": 3
        }, headers={"Authorization": f"Bearer {admin_token}"})

        response = client.get(
            "/api/vehicles/search?make=Toyota",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 200
        results = response.json()
        assert len(results) == 1
        assert results[0]["make"] == "Toyota"

    def test_search_by_category(self, client, admin_token, customer_token):
        """Searching by category should return only vehicles in that category."""
        client.post("/api/vehicles", json={
            "make": "Toyota", "model": "Fortuner", "category": "SUV",
            "price": 4200000, "quantity": 5
        }, headers={"Authorization": f"Bearer {admin_token}"})
        client.post("/api/vehicles", json={
            "make": "Honda", "model": "City", "category": "Sedan",
            "price": 900000, "quantity": 3
        }, headers={"Authorization": f"Bearer {admin_token}"})

        response = client.get(
            "/api/vehicles/search?category=SUV",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        results = response.json()
        assert all(v["category"] == "SUV" for v in results)

    def test_search_by_price_range(self, client, admin_token, customer_token):
        """Searching with min/max price should filter correctly."""
        client.post("/api/vehicles", json={
            "make": "Cheap", "model": "Car", "category": "Hatch",
            "price": 500000, "quantity": 2
        }, headers={"Authorization": f"Bearer {admin_token}"})
        client.post("/api/vehicles", json={
            "make": "Expensive", "model": "Car", "category": "SUV",
            "price": 9000000, "quantity": 1
        }, headers={"Authorization": f"Bearer {admin_token}"})

        response = client.get(
            "/api/vehicles/search?min_price=1000000&max_price=5000000",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        results = response.json()
        # Neither vehicle should appear: 500000 < min, 9000000 > max
        assert len(results) == 0

    def test_search_no_filters_returns_all(self, client, admin_token, customer_token):
        """Search with no filters should return all vehicles."""
        client.post("/api/vehicles", json={
            "make": "A", "model": "Car", "category": "Sedan",
            "price": 100000, "quantity": 1
        }, headers={"Authorization": f"Bearer {admin_token}"})

        response = client.get(
            "/api/vehicles/search",
            headers={"Authorization": f"Bearer {customer_token}"}
        )
        assert response.status_code == 200
        assert len(response.json()) >= 1
