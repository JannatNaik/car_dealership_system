// AdminPanel.jsx - Admin-only inventory management screen: quick stats,
// plus a table of every vehicle with Edit / Restock / Delete actions.

import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAllVehicles, deleteVehicle, restockVehicle } from '../services/vehicleService'
import { formatCurrency } from '../utils/formatCurrency'
import ConfirmDialog from '../components/ConfirmDialog'
import RestockModal from '../components/RestockModal'

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [restockTarget, setRestockTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadVehicles = useCallback(async () => {
    setLoading(true)
    try {
      setVehicles(await getAllVehicles())
    } catch {
      toast.error('Could not load inventory.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVehicles()
  }, [loadVehicles])

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await deleteVehicle(deleteTarget.id)
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id))
      toast.success(`${deleteTarget.make} ${deleteTarget.model} was deleted.`)
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Delete failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestock = async (amount) => {
    setActionLoading(true)
    try {
      const updated = await restockVehicle(restockTarget.id, amount)
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      toast.success(`Added ${amount} unit${amount === 1 ? '' : 's'} to ${updated.make} ${updated.model}.`)
      setRestockTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Restock failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const totalVehicles = vehicles.length
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0)
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length
  const inventoryValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the dealership's vehicle inventory.</p>
        </div>
        <Link to="/add-vehicle" className="btn-primary flex items-center gap-2 w-fit">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total vehicles" value={totalVehicles} />
        <StatCard label="Units in stock" value={totalUnits} />
        <StatCard label="Low stock" value={lowStockCount} tone={lowStockCount > 0 ? 'amber' : 'default'} />
        <StatCard label="Out of stock" value={outOfStockCount} tone={outOfStockCount > 0 ? 'red' : 'default'} />
        <StatCard label="Inventory value" value={formatCurrency(inventoryValue)} className="col-span-2 lg:col-span-4" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading inventory…</div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No vehicles yet.{' '}
            <Link to="/add-vehicle" className="text-brand-600 font-semibold">
              Add your first one
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold">Vehicle</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {v.make} {v.model}
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge-blue">{v.category}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{formatCurrency(v.price)}</td>
                    <td className="px-5 py-4">
                      <span className={v.quantity === 0 ? 'badge-red' : v.quantity <= 3 ? 'badge-amber' : 'badge-green'}>
                        {v.quantity} in stock
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setRestockTarget(v)} className="btn-secondary !px-3 !py-1.5 text-xs">
                          Restock
                        </button>
                        <Link to={`/edit/${v.id}`} className="btn-secondary !px-3 !py-1.5 text-xs">
                          Edit
                        </Link>
                        <button onClick={() => setDeleteTarget(v)} className="btn-danger !px-3 !py-1.5 text-xs">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this vehicle?"
        message={deleteTarget ? `${deleteTarget.make} ${deleteTarget.model} will be permanently removed from the inventory.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading}
      />

      <RestockModal
        open={Boolean(restockTarget)}
        vehicle={restockTarget}
        onConfirm={handleRestock}
        onCancel={() => setRestockTarget(null)}
        loading={actionLoading}
      />
    </div>
  )
}

function StatCard({ label, value, tone = 'default', className = '' }) {
  const toneClasses = {
    default: 'text-gray-900',
    amber: 'text-amber-600',
    red: 'text-red-600',
  }
  return (
    <div className={`card ${className}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${toneClasses[tone]}`}>{value}</p>
    </div>
  )
}
