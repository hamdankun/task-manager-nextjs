'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

interface ChangePasswordFormProps {
  onSubmit: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>
  error?: string | null | undefined
  success?: string | null | undefined
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ChangePasswordForm({
  onSubmit,
  error: externalError,
  success,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [error, setError] = useState<string | null>(externalError || null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const newPassword = watch('newPassword')

  const onFormSubmit = async (data: PasswordFormData) => {
    setError(null)

    try {
      await onSubmit(data.currentPassword, data.newPassword, data.confirmPassword)
      reset() // Clear form on success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      )
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Change Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your password to keep your account secure
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
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
              className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.currentPassword
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.newPassword
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Confirm New Password
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
                  value === newPassword || 'Passwords do not match',
              })}
              className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
                errors.confirmPassword
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
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
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-950 ${
            !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
              : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50'
          }`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            'Change Password'
          )}
        </button>
      </form>
    </div>
  )
}
