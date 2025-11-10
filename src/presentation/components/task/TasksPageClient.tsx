'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { createTaskAction, getTasksAction, updateTaskAction, deleteTaskAction } from '@presentation/actions/task'
import { TaskForm, TaskList } from '@presentation/components/task'

interface Task {
  id: string
  title: string
  description?: string
  status: 'to do' | 'in progress' | 'done'
  createdAt: Date
  updatedAt: Date
}

export default function TasksPageClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true)
        const result = await getTasksAction()
        if (result.success && result.data) {
          setTasks(
            result.data.map(task => ({
              ...task,
              status: task.status as 'to do' | 'in progress' | 'done',
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
            }))
          )
        } else {
          setError(result.error || 'Failed to load tasks')
        }
      } catch (err) {
        setError('An error occurred while loading tasks')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Create task
  const handleCreateTask = async (title: string, description?: string) => {
    try {
      const result = await createTaskAction({ title, description })
      if (result.success && result.data) {
        setTasks(prev => [
          {
            id: result.data!.id,
            title: result.data!.title,
            description: description,
            status: (result.data!.status as 'to do' | 'in progress' | 'done') || 'to do',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...prev,
        ])
        setShowForm(false)
      } else {
        setError(result.error || 'Failed to create task')
      }
    } catch (err) {
      setError('An error occurred while creating task')
      console.error(err)
    }
  }

  // Update task
  const handleUpdateTask = async (id: string, title: string, description?: string) => {
    try {
      const result = await updateTaskAction(id, { title, description })
      if (result.success) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id
              ? { ...task, title, description, updatedAt: new Date() }
              : task
          )
        )
        setEditingTaskId(null)
      } else {
        setError(result.error || 'Failed to update task')
      }
    } catch (err) {
      setError('An error occurred while updating task')
      console.error(err)
    }
  }

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      setDeletingTaskId(id)
      const result = await deleteTaskAction(id)
      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== id))
      } else {
        setError(result.error || 'Failed to delete task')
      }
    } catch (err) {
      setError('An error occurred while deleting task')
      console.error(err)
    } finally {
      setDeletingTaskId(null)
    }
  }

  // Change task status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const result = await updateTaskAction(id, { status: newStatus })
      if (result.success) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id
              ? { ...task, status: (newStatus as 'to do' | 'in progress' | 'done') || 'to do', updatedAt: new Date() }
              : task
          )
        )
      } else {
        setError(result.error || 'Failed to update task status')
      }
    } catch (err) {
      setError('An error occurred while updating task status')
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your tasks
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingTaskId(null)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <TaskForm
          onSubmit={(title, description) => handleCreateTask(title, description)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTaskId && (
        <div>
          {/* Edit form would go here - for now, we'll close it */}
          {tasks.find(t => t.id === editingTaskId) && (
            <TaskForm
              initialTitle={tasks.find(t => t.id === editingTaskId)!.title}
              initialDescription={tasks.find(t => t.id === editingTaskId)!.description}
              isEditing={true}
              onSubmit={(title, description) =>
                handleUpdateTask(editingTaskId, title, description)
              }
              onCancel={() => setEditingTaskId(null)}
            />
          )}
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onEdit={id => setEditingTaskId(id)}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        isDeletingId={deletingTaskId || undefined}
      />
    </div>
  )
}
