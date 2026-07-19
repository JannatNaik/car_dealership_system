// ConfirmDialog.jsx - Generic "are you sure?" modal for destructive actions.
// Kept content-agnostic (title/message/confirmLabel are props) so it can be
// reused anywhere a confirmation step is needed.

import React from 'react'

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50" onClick={onCancel} />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}

        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${danger ? 'btn-danger' : 'btn-primary'} flex-1`}
            disabled={loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
