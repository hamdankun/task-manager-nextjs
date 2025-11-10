'use server'

import { DeleteTaskUseCase, type DeleteTaskInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { TaskRepository } from '@data/repositories'
import { getAuthUser } from '@/src/lib/auth'

/**
 * Delete Task Server Action
 * Deletes a task for authenticated user
 * Follows Clean Architecture with dependency injection
 */
export async function deleteTaskAction(taskId: string): Promise<{
  success: boolean
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
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository)
    await deleteTaskUseCase.execute({
      id: taskId,
      userId: authUser.id,
    } as DeleteTaskInput)

    return {
      success: true,
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
    console.error('Delete task error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
