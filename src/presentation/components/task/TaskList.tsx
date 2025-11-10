'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { TaskStatus } from '@domain/entities'

interface Task {
  id: string
  title: string
  description?: string
  status: 'to do' | 'in progress' | 'done'
  createdAt: Date
  updatedAt: Date
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (id: string) => void
  onDelete: (id: string, isDeleting?: boolean) => void
  onStatusChange: (id: string, status: string) => void
  isDeletingId?: string
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  isDeletingId,
}: TaskListProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const filteredTasks = selectedFilter
    ? tasks.filter(task => task.status === selectedFilter)
    : tasks

  const statusOptions = [
    { value: 'to do', label: 'To Do' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'to do').length,
    inProgress: tasks.filter(t => t.status === 'in progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div>
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Tasks
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            To Do
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.todo}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            In Progress
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.inProgress}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Done
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.done}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <button
          onClick={() => setSelectedFilter(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {tasks.length === 0
              ? 'No tasks yet. Create your first task to get started!'
              : 'No tasks matching the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              createdAt={task.createdAt}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isDeleting={isDeletingId === task.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
