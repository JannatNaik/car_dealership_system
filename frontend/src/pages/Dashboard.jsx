// Dashboard.jsx - The homepage: search + filter controls above a responsive
// grid of all available vehicles, each with a working Purchase button.

import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import VehicleCard from '../components/VehicleCard'
import SearchBar from '../components/SearchBar'
import Filter from '../components/Filter'
import { getAllVehicles, searchVehicles, purchaseVehicle } from '../services/vehicleService'

export default function Dashboard() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState(null)
  const [activeFilters, setActiveFilters] = useState({ category: '', minPrice: '', maxPrice: '' })
  const [activeQuery, setActiveQuery] = useState('')

  const loadVehicles = useCallback(async (query = '', filters = {}) => {
    setLoading(true)
    try {
      const hasQuery = Boolean(query)
      const hasFilters = filters.category || filters.minPrice || filters.maxPrice

      if (!hasQuery && !hasFilters) {
        setVehicles(await getAllVehicles())
        return
      }

      if (hasQuery) {
        // The backend searches make/model as separate fields, so a single
        // free-text box needs two calls merged together (deduped by id) to
        // behave like "search by make OR model".
        const [byMake, byModel] = await Promise.all([
          searchVehicles({ ...filters, make: query }),
          searchVehicles({ ...filters, model: query }),
        ])
        const merged = new Map()
        ;[...byMake, ...byModel].forEach((v) => merged.set(v.id, v))
        setVehicles(Array.from(merged.values()))
      } else {
        setVehicles(await searchVehicles(filters))
      }
    } catch (err) {
      toast.error('Could not load vehicles. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const handleSearch = (query) => {
    setActiveQuery(query)
    loadVehicles(query, activeFilters)
  }

  const handleFilter = (filters) => {
    setActiveFilters(filters)
    loadVehicles(activeQuery, filters)
  }

  const handlePurchase = async (vehicle) => {
    setPurchasingId(vehicle.id)
    try {
      const updated = await purchaseVehicle(vehicle.id)
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      toast.success(`You purchased the ${updated.make} ${updated.model}!`)
    } catch (err) {
      const message = err.response?.data?.detail || 'Purchase failed. Please try again.'
      toast.error(message)
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white p-8 mb-8 relative overflow-hidden">
        <svg className="w-64 h-64 text-white/10 absolute -bottom-10 -right-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-3.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-3H8.1l-1 3z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-extrabold relative">Welcome back, {user?.username}.</h1>
        <p className="text-brand-100 mt-1 relative">Browse the current inventory and find your next vehicle.</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar onSearch={handleSearch} />
        <Filter onFilter={handleFilter} />
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-80 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-gray-700">No vehicles match your search.</p>
          <p className="text-gray-500 mt-1">Try a different search term or clear your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              purchasing={purchasingId === vehicle.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
