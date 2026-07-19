// AuthContext.jsx - Global authentication state management using React Context API.
// Stores the logged-in user, their JWT token, and their role.
// Provides login, register, and logout functions to the entire app.

import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

// Create the context object
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Load user/token from localStorage on first render so the session persists
  // across browser refreshes.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  // Whenever the token changes, update the Authorization header on all
  // future Axios requests automatically.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  // ── Register a new user ──────────────────────────────────────────────────
  const register = async (username, email, password, role = 'customer') => {
    const response = await api.post('/api/auth/register', {
      username, email, password, role
    })
    return response.data
  }

  // ── Log in and store the token + user ────────────────────────────────────
  const login = async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password })
    const { access_token, user: userData } = response.data

    // Save to state
    setToken(access_token)
    setUser(userData)

    // Persist in localStorage so sessions survive page refreshes
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))

    return userData
  }

  // ── Log out — clear all stored session data ───────────────────────────────
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  // Convenient helpers
  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoggedIn, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — makes consuming the context much cleaner in components.
// Usage: const { user, login, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
