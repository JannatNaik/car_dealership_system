// NotFound.jsx - Shown for any route that doesn't match.

import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <img src="/car-icon.svg" alt="" className="w-12 h-12 mb-4 opacity-60" />
      <h1 className="text-3xl font-extrabold text-gray-900">Page not found</h1>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to Dashboard
      </Link>
    </div>
  )
}
