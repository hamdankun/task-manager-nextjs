'use server'

import { CreateTaskUseCase, type CreateTaskInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { TaskRepository } from '@data/repositories'
import { getAuthUser } from '@/src/lib/auth'

/**
 * Create Task Server Action
 * Allows authenticated user to create a new task
 * Follows Clean Architecture with dependency injection
 */
export async function createTaskAction(input: Omit<CreateTaskInput, 'userId'>): Promise<{
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
    const createTaskUseCase = new CreateTaskUseCase(taskRepository)
    const createdTask = await createTaskUseCase.execute({
      ...input,
      userId: authUser.id,
    })

    return {
      success: true,
      data: {
        id: createdTask.id,
        title: createdTask.title,
        status: createdTask.status,
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
    console.error('Create task error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
