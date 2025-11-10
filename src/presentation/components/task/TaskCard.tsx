'use client'

import { useState } from 'react'
import { Trash2, Edit2, ChevronDown } from 'lucide-react'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: 'to do' | 'in progress' | 'done'
  createdAt: Date
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  isDeleting?: boolean
}

export function TaskCard({
  id,
  title,
  description,
  status,
  createdAt,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting = false,
}: TaskCardProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  const isCompleted = status === 'done'

  const statusColors = {
    'to do': 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700',
    'in progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    done: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
  }

  const statusLabels = {
    'to do': 'To Do',
    'in progress': 'In Progress',
    done: 'Done',
  }

  const statusOptions: Array<'to do' | 'in progress' | 'done'> = ['to do', 'in progress', 'done']

  const handleStatusChange = (newStatus: 'to do' | 'in progress' | 'done') => {
    onStatusChange(id, newStatus)
    setIsStatusOpen(false)
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Status and Created Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusColors[status]} hover:shadow-md`}
          >
            {statusLabels[status]}
            <ChevronDown className={`w-4 h-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Status Dropdown */}
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-max">
              {statusOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleStatusChange(option)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    status === option
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {statusLabels[option]}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(id)}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
