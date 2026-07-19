// Register.jsx - Standalone full-screen registration page.
//
// Note on the role selector: the backend currently accepts a `role` field at
// registration and has no separate admin-seeding mechanism, so this is the
// only way to create an admin account for testing the admin panel. Worth
// revisiting for a real deployment (see the security note flagged earlier).

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register: registerUser, login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'customer' } })

  const password = watch('password')

  const onSubmit = async ({ username, email, password, role }) => {
    setSubmitting(true)
    try {
      await registerUser(username, email, password, role)
      toast.success('Account created! Logging you in…')
      // Log the user straight in so they land on the dashboard immediately.
      await login(username, password)
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Hero panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 relative overflow-hidden items-center justify-center p-12">
        <svg
          className="w-[28rem] h-[28rem] text-white/10 absolute -bottom-16 -right-16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-3.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-3H8.1l-1 3z" />
        </svg>
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <img src="/car-icon.svg" alt="" className="w-9 h-9" />
            <span className="text-2xl font-extrabold">AutoDrive</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">Join the dealership floor, digitally.</h1>
          <p className="mt-4 text-brand-100">
            Create an account to start purchasing vehicles, or register as an admin to manage the inventory.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/car-icon.svg" alt="" className="w-8 h-8" />
            <span className="text-xl font-extrabold text-gray-900">AutoDrive</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">It only takes a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input
                {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                className="input-field"
                placeholder="jane_doe"
                autoFocus
              />
              {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field"
                placeholder="jane@example.com"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Confirm password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="form-label">Account type</label>
              <select {...register('role')} className="input-field">
                <option value="customer">Customer — browse &amp; purchase vehicles</option>
                <option value="admin">Admin — manage inventory</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
