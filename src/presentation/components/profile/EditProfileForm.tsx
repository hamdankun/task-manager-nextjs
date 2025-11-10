'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, AlertCircle, Loader2 } from 'lucide-react'

interface EditProfileFormProps {
  initialEmail: string
  initialFirstName: string
  initialLastName: string
  onSubmit: (email: string, firstName: string, lastName: string) => Promise<void>
  error?: string | null | undefined
  success?: string | null | undefined
}

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
}

export function EditProfileForm({
  initialEmail,
  initialFirstName,
  initialLastName,
  onSubmit,
  error: externalError,
  success,
}: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: initialEmail,
    },
  })

  const [error, setError] = useState<string | null>(externalError || null)

  const onFormSubmit = async (data: ProfileFormData) => {
    setError(null)

    try {
      await onSubmit(data.email, data.firstName, data.lastName)
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
          Edit Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your personal information
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
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
              errors.email
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-950 ${
            isDirty && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
              : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50'
          }`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  )
}
