// Filter.jsx - Category and price-range filtering, separate from the free-text
// SearchBar so each control has a single, clear job.

import React, { useState } from 'react'
import { VEHICLE_CATEGORIES } from '../constants/categories'

const EMPTY_FILTERS = { category: '', minPrice: '', maxPrice: '' }

export default function Filter({ onFilter }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [open, setOpen] = useState(false)

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const applyFilters = () => onFilter(filters)

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    onFilter(EMPTY_FILTERS)
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-secondary flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M10 12h4M11 16h2" />
        </svg>
        Filters
        {activeCount > 0 && <span className="badge-blue">{activeCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-30">
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select value={filters.category} onChange={handleChange('category')} className="input-field">
              <option value="">All categories</option>
              {VEHICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label className="form-label">Min price (₹)</label>
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={handleChange('minPrice')}
                placeholder="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Max price (₹)</label>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={handleChange('maxPrice')}
                placeholder="Any"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="button" onClick={applyFilters} className="btn-primary flex-1">
              Apply
            </button>
            <button type="button" onClick={clearFilters} className="btn-secondary flex-1">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
