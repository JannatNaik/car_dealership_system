// ProtectedRoute.jsx - Wraps a page and enforces access rules before rendering it.
//
// Usage:
//   <ProtectedRoute><Dashboard /></ProtectedRoute>            -> any logged-in user
//   <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute> -> admins only

import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useAuth()
  const location = useLocation()
  const deniedForNonAdmin = isLoggedIn && adminOnly && !isAdmin

  // Side effects (like showing a toast) don't belong in the render path —
  // run this after render so it doesn't fire twice under StrictMode.
  useEffect(() => {
    if (deniedForNonAdmin) {
      toast.error('Admin access required for that page.')
    }
  }, [deniedForNonAdmin])

  if (!isLoggedIn) {
    // Remember where the user was headed so we could send them back after
    // login if we wanted to; for now we just bounce to /login.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (deniedForNonAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
