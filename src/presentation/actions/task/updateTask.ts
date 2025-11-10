'use server'

import { UpdateTaskUseCase, type UpdateTaskInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { TaskRepository } from '@data/repositories'
import { getAuthUser } from '@/src/lib/auth'

/**
 * Update Task Server Action
 * Updates a task for authenticated user
 * Follows Clean Architecture with dependency injection
 */
export async function updateTaskAction(
  taskId: string,
  input: Omit<UpdateTaskInput, 'id' | 'userId'>
): Promise<{
  success: boolean
  data?: { id: string; title: string; status: string }
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
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepository)
    const updatedTask = await updateTaskUseCase.execute({
      id: taskId,
      userId: authUser.id,
      ...input,
    })

    return {
      success: true,
      data: {
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
      },
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
    console.error('Update task error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
