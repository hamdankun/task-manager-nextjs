'use server'

import { GetTasksUseCase, type GetTasksInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { TaskRepository } from '@data/repositories'
import { getAuthUser } from '@/src/lib/auth'

/**
 * Get Tasks Server Action
 * Retrieves all tasks for authenticated user with optional status filter
 * Follows Clean Architecture with dependency injection
 */
export async function getTasksAction(filter?: { status?: string }): Promise<{
  success: boolean
  data?: Array<{ id: string; title: string; description?: string; status: string; createdAt: Date; updatedAt: Date }>
  error?: string
}> {
  try {
    // Get authenticated user from cookie
    const authUser = await getAuthUser()
    if (!authUser) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Instantiate dependencies
    const taskRepository = new TaskRepository()

    // Create and execute use case
    const getTasksUseCase = new GetTasksUseCase(taskRepository)
    const tasks = await getTasksUseCase.execute({
      userId: authUser.id,
      status: filter?.status,
    } as GetTasksInput)

    return {
      success: true,
      data: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt || new Date(),
        updatedAt: task.updatedAt || new Date(),
      })),
    }
  } catch (error) {
    // Handle domain layer errors
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Handle unexpected errors
    console.error('Get tasks error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
