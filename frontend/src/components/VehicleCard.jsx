// VehicleCard.jsx - The primary building block of the Dashboard grid.
// Shows a category-themed placeholder image (the backend doesn't store real
// photos), key details, a stock indicator, and a Purchase button that's
// disabled whenever quantity is zero.

import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

// A different gradient per category keeps the grid visually varied even
// though we don't have real product photography to work with.
const CATEGORY_GRADIENTS = {
  Sedan: 'from-blue-500 to-indigo-600',
  SUV: 'from-emerald-500 to-teal-700',
  Hatchback: 'from-sky-400 to-blue-600',
  Coupe: 'from-rose-500 to-red-700',
  Convertible: 'from-amber-400 to-orange-600',
  Truck: 'from-slate-500 to-slate-800',
  Van: 'from-violet-500 to-purple-700',
  Electric: 'from-cyan-400 to-emerald-600',
}
const DEFAULT_GRADIENT = 'from-brand-500 to-brand-900'

export default function VehicleCard({ vehicle, onPurchase, purchasing }) {
  const gradient = CATEGORY_GRADIENTS[vehicle.category] || DEFAULT_GRADIENT
  const outOfStock = vehicle.quantity <= 0
  const lowStock = vehicle.quantity > 0 && vehicle.quantity <= 3

  return (
    <div className="card flex flex-col p-0 overflow-hidden group">
      {/* Placeholder "photo" */}
      <Link to={`/vehicles/${vehicle.id}`} className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <svg
          className="w-24 h-24 text-white/25 absolute -bottom-2 -right-2 group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-3.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-3H8.1l-1 3z" />
        </svg>
        <span className="badge-blue absolute top-3 left-3 bg-white/90">{vehicle.category}</span>
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/vehicles/${vehicle.id}`} className="hover:text-brand-700 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 leading-snug">
            {vehicle.make} {vehicle.model}
          </h3>
        </Link>

        <p className="text-2xl font-extrabold text-brand-700 mt-2">{formatCurrency(vehicle.price)}</p>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span
            className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-green-500'}`}
          />
          <span className="text-gray-600">
            {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
            {lowStock && !outOfStock && <span className="text-amber-600 font-medium"> — low stock</span>}
          </span>
        </div>

        <button
          onClick={() => onPurchase(vehicle)}
          disabled={outOfStock || purchasing}
          className="btn-primary w-full mt-4"
        >
          {outOfStock ? 'Out of Stock' : purchasing ? 'Purchasing…' : 'Purchase'}
        </button>
      </div>
    </div>
  )
}
