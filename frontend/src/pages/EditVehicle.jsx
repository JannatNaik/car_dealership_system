// EditVehicle.jsx - Admin-only page for editing an existing vehicle's details.

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import VehicleForm from '../components/VehicleForm'
import { getVehicleById, updateVehicle } from '../services/vehicleService'

export default function EditVehicle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
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

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      const updated = await updateVehicle(id, data)
      toast.success(`${updated.make} ${updated.model} was updated.`)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not update vehicle.')
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
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Edit vehicle</h1>
        <p className="text-sm text-gray-500 mb-6">Update the details below and save your changes.</p>

        {loading ? (
          <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
        ) : vehicle ? (
          <VehicleForm defaultValues={vehicle} onSubmit={handleSubmit} submitLabel="Save changes" submitting={submitting} />
        ) : (
          <p className="text-gray-500">Vehicle not found.</p>
        )}
      </div>
    </div>
  )
}
