// App.jsx - Root component. Defines every route in the app:
//   Public:            /login, /register
//   Protected:         /              (Dashboard)
//                       /vehicles/:id (Vehicle Details)
//   Protected + Admin: /admin, /add-vehicle, /edit/:id

import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import VehicleDetails from './pages/VehicleDetails'
import AdminPanel from './pages/AdminPanel'
import AddVehicle from './pages/AddVehicle'
import EditVehicle from './pages/EditVehicle'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Public auth pages - standalone, no Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Any logged-in user */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <VehicleDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AdminPanel />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-vehicle"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <AddVehicle />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute adminOnly>
            <Layout>
              <EditVehicle />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
