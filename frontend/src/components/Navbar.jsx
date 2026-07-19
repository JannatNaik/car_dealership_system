// Navbar.jsx - Sticky top navigation. Adapts its links based on role:
// customers see "Browse", admins additionally see "Admin Panel".

import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const navLinkClasses = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully.')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img src="/car-icon.svg" alt="" className="w-8 h-8" />
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Auto<span className="text-brand-600">Drive</span>
            </span>
          </NavLink>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClasses}>
              Browse
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses}>
                Admin Panel
              </NavLink>
            )}
          </nav>

          {/* User menu (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
              <span className={isAdmin ? 'badge-blue' : 'badge-green'}>{isAdmin ? 'Admin' : 'Customer'}</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Log out
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClasses} onClick={() => setMenuOpen(false)}>
              Browse
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClasses} onClick={() => setMenuOpen(false)}>
                Admin Panel
              </NavLink>
            )}
            <div className="flex items-center justify-between px-3 pt-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                <span className={isAdmin ? 'badge-blue' : 'badge-green'}>{isAdmin ? 'Admin' : 'Customer'}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
