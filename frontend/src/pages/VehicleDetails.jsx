// VehicleDetails.jsx - Full-page view of a single vehicle, reached by
// clicking a vehicle card on the Dashboard.

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getVehicleById, purchaseVehicle } from '../services/vehicleService'
import { formatCurrency } from '../utils/formatCurrency'
import { useAuth } from '../context/AuthContext'

export default function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getVehicleById(id)
      .then((data) => {
        if (!cancelled) setVehicle(data)
      })
      .catch(() => {
        if (!cancelled) toast.error('That vehicle could not be found.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      const updated = await purchaseVehicle(vehicle.id)
      setVehicle(updated)
      toast.success(`You purchased the ${updated.make} ${updated.model}!`)
    } catch (err) {
      const message = err.response?.data?.detail || 'Purchase failed. Please try again.'
      toast.error(message)
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return <div className="card h-96 animate-pulse bg-gray-100" />
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-gray-700">Vehicle not found.</p>
        <Link to="/" className="text-brand-600 font-semibold hover:text-brand-700 mt-2 inline-block">
          &larr; Back to browsing
        </Link>
      </div>
    )
  }

  const outOfStock = vehicle.quantity <= 0

  return (
    <div>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 h-72 lg:h-full flex items-center justify-center relative overflow-hidden">
          <svg className="w-56 h-56 text-white/15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-3.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-3H8.1l-1 3z" />
          </svg>
          <span className="badge-blue absolute top-4 left-4 bg-white/90">{vehicle.category}</span>
        </div>

        <div className="card">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-3xl font-extrabold text-brand-700 mt-4">{formatCurrency(vehicle.price)}</p>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${outOfStock ? 'bg-red-500' : vehicle.quantity <= 3 ? 'bg-amber-500' : 'bg-green-500'}`}
            />
            <span className="text-gray-700 font-medium">
              {outOfStock ? 'Out of stock' : `${vehicle.quantity} unit${vehicle.quantity === 1 ? '' : 's'} in stock`}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <dt className="text-gray-500">Make</dt>
              <dd className="font-semibold text-gray-900">{vehicle.make}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Model</dt>
              <dd className="font-semibold text-gray-900">{vehicle.model}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Category</dt>
              <dd className="font-semibold text-gray-900">{vehicle.category}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Vehicle ID</dt>
              <dd className="font-semibold text-gray-900">#{vehicle.id}</dd>
            </div>
          </dl>

          <button onClick={handlePurchase} disabled={outOfStock || purchasing} className="btn-primary w-full mt-8">
            {outOfStock ? 'Out of Stock' : purchasing ? 'Purchasing…' : 'Purchase this vehicle'}
          </button>

          {isAdmin && (
            <Link to={`/edit/${vehicle.id}`} className="btn-secondary w-full mt-3 block text-center">
              Edit vehicle
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
