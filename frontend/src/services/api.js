// api.js - Central Axios instance used by every service in the app.
//
// Two responsibilities live here:
//  1. Attach the JWT (if we have one) to every outgoing request.
//  2. Detect an expired/invalid token (401 response) and force a clean logout,
//     so the user always lands back on the login page instead of seeing
//     confusing "stuck" screens.
//
// We read the token directly from localStorage in the interceptor (rather than
// relying solely on AuthContext setting a default header) so requests are
// authenticated correctly even on the very first render after a page refresh,
// regardless of React effect ordering.

import axios from 'axios'

// In dev, Vite's proxy (see vite.config.js) forwards "/api/*" to the FastAPI
// backend on localhost:8000, so we can leave the base URL empty. For a
// production build, set VITE_API_BASE_URL to the deployed backend's origin.
const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor: attach the bearer token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: handle expired/invalid sessions ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    // Don't force-logout on a failed login/register attempt — that 401/400
    // is an expected "wrong credentials" case the form itself should show.
    const isAuthEndpoint = url.includes('/api/auth/login') || url.includes('/api/auth/register')

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']

      // Avoid redirect loops if we're already on the login page.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
