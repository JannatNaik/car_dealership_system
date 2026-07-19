// AddVehicle.jsx - Admin-only page for adding a new vehicle to the inventory.

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import VehicleForm from '../components/VehicleForm'
import { createVehicle } from '../services/vehicleService'

export default function AddVehicle() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      const created = await createVehicle(data)
      toast.success(`${created.make} ${created.model} was added to the inventory.`)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not add vehicle.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Admin Panel
      </Link>

      <div className="card">
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Add a new vehicle</h1>
        <p className="text-sm text-gray-500 mb-6">Fill in the details below to list it in the inventory.</p>
        <VehicleForm onSubmit={handleSubmit} submitLabel="Add vehicle" submitting={submitting} />
      </div>
    </div>
  )
}
