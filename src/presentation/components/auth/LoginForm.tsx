'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

/**
 * LoginForm Component
 *
 * This component provides a clean, accessible login form UI.
 *
 * Architecture: Presentation Layer
 * - Pure UI component (no business logic)
 * - Form state management only
 * - Communicates through props (onSubmit callback)
 * - Zero dependencies on domain or data layers
 *
 * Features:
 * - Email and password input fields
 * - Form validation feedback
 * - Loading state
 * - Error messages
 * - Accessible (labels, ARIA attributes)
 * - Responsive design with Tailwind CSS
 * - Sign up link
 */

interface LoginFormProps {
  /**
   * Callback when form is submitted
   * @param email User email
   * @param password User password
   */
  onSubmit: (email: string, password: string) => Promise<void>

  /** Optional error message to display */
  error?: string

  /** Optional success message */
  success?: string
}

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm({
  onSubmit,
  error: externalError,
  success,
}: LoginFormProps) {
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(externalError || null)

  const onFormSubmit = async (data: LoginFormData) => {
    setError(null)

    try {
      await onSubmit(data.email, data.password)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      )
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign In
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back. Sign in to your account.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300 text-sm font-medium">
            {success}
          </p>
        </div>
      )}

      {/* Error Message */}
      {(error || externalError) && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">
            {error || externalError}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.email
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              aria-label="Email address"
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.password
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              aria-label="Password"
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting || !isDirty}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-950 ${
            isValid && isDirty && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
              : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50'
          }`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-sm text-gray-600 dark:text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
        <p>
          By signing in, you agree to our{' '}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
