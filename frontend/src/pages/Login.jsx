// Login.jsx - Standalone full-screen login page (no Navbar/Footer — this is
// the entry point before a user has a session).

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ username, password }) => {
    setSubmitting(true)
    try {
      const user = await login(username, password)
      toast.success(`Welcome back, ${user.username}!`)
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.detail || 'Invalid username or password.'
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
          <h1 className="text-4xl font-extrabold leading-tight">Find your next car in the inventory that never sleeps.</h1>
          <p className="mt-4 text-brand-100">
            Browse live stock, filter by make, model, category, and price, and check out the moment you find the one.
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

          <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back — enter your details below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input
                {...register('username', { required: 'Username is required' })}
                className="input-field"
                placeholder="jane_doe"
                autoFocus
              />
              {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
