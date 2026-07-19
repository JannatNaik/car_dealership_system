// RestockModal.jsx - Lets an admin add stock to a vehicle.
// The backend's VehicleRestock schema requires quantity > 0, so we validate
// the same rule client-side before submitting.

import React, { useState } from 'react'

export default function RestockModal({ open, vehicle, onConfirm, onCancel, loading = false }) {
  const [amount, setAmount] = useState(1)
  const [error, setError] = useState('')

  if (!open || !vehicle) return null

  const handleConfirm = () => {
    const parsed = Number(amount)
    if (!Number.isInteger(parsed) || parsed <= 0) {
      setError('Enter a whole number greater than 0.')
      return
    }
    setError('')
    onConfirm(parsed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onCancel} />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-900">Restock vehicle</h3>
        <p className="text-sm text-gray-600 mt-1">
          {vehicle.make} {vehicle.model} — currently {vehicle.quantity} in stock
        </p>

        <div className="mt-4">
          <label className="form-label">Quantity to add</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field"
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>

        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Restocking…' : 'Restock'}
          </button>
        </div>
      </div>
    </div>
  )
}
