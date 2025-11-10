'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

/**
 * SignupForm Component
 *
 * This component provides a clean, accessible signup form UI.
 *
 * Architecture: Presentation Layer
 * - Pure UI component (no business logic)
 * - Form state management only
 * - Communicates through props (onSubmit callback)
 * - Zero dependencies on domain or data layers
 *
 * Features:
 * - Email, password, and name input fields
 * - Real-time form validation
 * - Password strength indicator
 * - Loading state
 * - Error messages
 * - Accessible (labels, ARIA attributes)
 * - Responsive design with Tailwind CSS
 * - Sign in link
 */

interface SignupFormProps {
  /**
   * Callback when form is submitted
   * @param email User email
   * @param password User password
   * @param firstName User first name (optional)
   * @param lastName User last name (optional)
   */
  onSubmit: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>

  /** Optional error message to display */
  error?: string

  /** Optional success message */
  success?: string
}

interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({
  onSubmit,
  error: externalError,
  success,
}: SignupFormProps) {
  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<SignupFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(externalError || null)

  const password = watch('password')

  // Password strength indicator
  const getPasswordStrength = (): { level: number; color: string; text: string } => {
    if (!password) return { level: 0, color: '', text: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const levels = [
      { level: 1, color: 'bg-red-500', text: 'Weak' },
      { level: 2, color: 'bg-orange-500', text: 'Fair' },
      { level: 3, color: 'bg-yellow-500', text: 'Good' },
      { level: 4, color: 'bg-lime-500', text: 'Strong' },
      { level: 5, color: 'bg-green-500', text: 'Very Strong' },
    ]

    return levels[Math.min(strength, 4)]
  }

  const passwordStrength = getPasswordStrength()

  const onFormSubmit = async (data: SignupFormData) => {
    setError(null)

    try {
      await onSubmit(data.email, data.password, data.firstName, data.lastName)
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
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join us and start managing your tasks efficiently.
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
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
              <input
                id="firstName"
                placeholder="John"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'At least 2 characters',
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                  errors.firstName
                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                }`}
                aria-label="First name"
                aria-invalid={!!errors.firstName}
                disabled={isSubmitting}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
              <input
                id="lastName"
                placeholder="Doe"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'At least 2 characters',
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                  errors.lastName
                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                }`}
                aria-label="Last name"
                aria-invalid={!!errors.lastName}
                disabled={isSubmitting}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
                  value: 8,
                  message: 'Password must be at least 8 characters',
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{
                      width: `${(passwordStrength.level / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16">
                  {passwordStrength.text}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Use uppercase, lowercase, numbers, and symbols for a stronger password
              </p>
            </div>
          )}

          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.confirmPassword
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              aria-label="Confirm password"
              aria-invalid={!!errors.confirmPassword}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword.message}
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
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        <span className="text-sm text-gray-600 dark:text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
        <p>
          By creating an account, you agree to our{' '}
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
