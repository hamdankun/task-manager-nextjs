'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, Loader2, X } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (title: string, description?: string) => Promise<void>
  onCancel: () => void
  initialTitle?: string
  initialDescription?: string
  isEditing?: boolean
}

interface TaskFormData {
  title: string
  description?: string
}

export function TaskForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialDescription = '',
  isEditing = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    mode: 'onChange',
    defaultValues: {
      title: initialTitle,
      description: initialDescription,
    },
  })

  const [error, setError] = useState<string | null>(null)

  const onFormSubmit = async (data: TaskFormData) => {
    setError(null)

    try {
      await onSubmit(data.title, data.description)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      )
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Task Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter task title"
            {...register('title', {
              required: 'Task title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
              maxLength: {
                value: 255,
                message: 'Title must be less than 255 characters',
              },
            })}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${
              errors.title
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            placeholder="Enter task description"
            rows={4}
            {...register('description', {
              maxLength: {
                value: 5000,
                message: 'Description must be less than 5000 characters',
              },
            })}
            className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none ${
              errors.description
                ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2.5 rounded-lg font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-950 ${
              !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-50'
            }`}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : isEditing ? (
              'Update Task'
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
