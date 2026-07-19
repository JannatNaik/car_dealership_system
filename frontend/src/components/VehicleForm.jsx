// VehicleForm.jsx - Shared form for the Add Vehicle and Edit Vehicle pages.
// Validation rules mirror the backend's Pydantic schema (VehicleCreate /
// VehicleUpdate) so users get instant feedback instead of a round trip:
//   - make, model, category: required
//   - price: required, must be greater than 0
//   - quantity: required, must be zero or more

import React from 'react'
import { useForm } from 'react-hook-form'
import { VEHICLE_CATEGORIES } from '../constants/categories'

export default function VehicleForm({ defaultValues, onSubmit, submitLabel = 'Save', submitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      make: '',
      model: '',
      category: '',
      price: '',
      quantity: '',
    },
  })

  const submit = (data) => {
    onSubmit({
      make: data.make.trim(),
      model: data.model.trim(),
      category: data.category,
      price: Number(data.price),
      quantity: Number(data.quantity),
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Make</label>
          <input
            {...register('make', { required: 'Make is required' })}
            className="input-field"
            placeholder="Toyota"
          />
          {errors.make && <p className="text-sm text-red-600 mt-1">{errors.make.message}</p>}
        </div>

        <div>
          <label className="form-label">Model</label>
          <input
            {...register('model', { required: 'Model is required' })}
            className="input-field"
            placeholder="Fortuner"
          />
          {errors.model && <p className="text-sm text-red-600 mt-1">{errors.model.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Category</label>
        <select {...register('category', { required: 'Category is required' })} className="input-field">
          <option value="">Select a category…</option>
          {VEHICLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            step="1"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              validate: (v) => v > 0 || 'Price must be greater than 0',
            })}
            className="input-field"
            placeholder="4200000"
          />
          {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="form-label">Quantity in stock</label>
          <input
            type="number"
            step="1"
            {...register('quantity', {
              required: 'Quantity is required',
              valueAsNumber: true,
              validate: (v) => (Number.isInteger(v) && v >= 0) || 'Quantity must be 0 or more',
            })}
            className="input-field"
            placeholder="10"
          />
          {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
