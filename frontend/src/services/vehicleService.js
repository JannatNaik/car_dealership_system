// vehicleService.js - All vehicle & inventory API calls in one place.
// Pages/components import from here instead of calling `api` directly,
// so the HTTP details (routes, payload shapes) only live in one spot.

import api from './api'

/** Fetch every vehicle in the inventory. */
export async function getAllVehicles() {
  const response = await api.get('/api/vehicles')
  return response.data
}

/**
 * Fetch a single vehicle by ID.
 * Note: the backend doesn't expose GET /api/vehicles/:id, so we fetch the
 * full list and find the match. Fine for a typical dealership's inventory
 * size; a dedicated endpoint would be worth adding if the catalog grows large.
 */
export async function getVehicleById(id) {
  const vehicles = await getAllVehicles()
  const vehicle = vehicles.find((v) => String(v.id) === String(id))
  if (!vehicle) {
    throw new Error('Vehicle not found')
  }
  return vehicle
}

/**
 * Search vehicles with optional filters. Any filter left undefined/empty
 * is simply omitted from the query string.
 */
export async function searchVehicles(filters = {}) {
  const params = {}
  if (filters.make) params.make = filters.make
  if (filters.model) params.model = filters.model
  if (filters.category) params.category = filters.category
  if (filters.minPrice !== undefined && filters.minPrice !== '') params.min_price = filters.minPrice
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') params.max_price = filters.maxPrice

  const response = await api.get('/api/vehicles/search', { params })
  return response.data
}

/** Add a new vehicle to the inventory. Admin only (enforced server-side). */
export async function createVehicle(vehicleData) {
  const response = await api.post('/api/vehicles', vehicleData)
  return response.data
}

/** Update an existing vehicle's details. Admin only (enforced server-side). */
export async function updateVehicle(id, vehicleData) {
  const response = await api.put(`/api/vehicles/${id}`, vehicleData)
  return response.data
}

/** Permanently delete a vehicle. Admin only (enforced server-side). */
export async function deleteVehicle(id) {
  const response = await api.delete(`/api/vehicles/${id}`)
  return response.data
}

/** Purchase one unit of a vehicle, decreasing its quantity by 1. */
export async function purchaseVehicle(id) {
  const response = await api.post(`/api/vehicles/${id}/purchase`)
  return response.data
}

/** Restock a vehicle by a given amount. Admin only (enforced server-side). */
export async function restockVehicle(id, quantity) {
  const response = await api.post(`/api/vehicles/${id}/restock`, { quantity })
  return response.data
}
