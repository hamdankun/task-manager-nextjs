'use server'

import { ChangePasswordUseCase, type ChangePasswordInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { UserRepository } from '@data/repositories'
import { PasswordService } from '@data/services'
import { getAuthUser } from '@/src/lib/auth'

/**
 * Change Password Server Action
 *
 * Allows user to change their password
 * Follows Clean Architecture with dependency injection
 */
export async function changePasswordAction(input: ChangePasswordInput): Promise<{
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
    const passwordService = new PasswordService()
    const userRepository = new UserRepository(passwordService)

    // Create and execute use case
    const changePasswordUseCase = new ChangePasswordUseCase(
      userRepository,
      passwordService
    )
    await changePasswordUseCase.execute(authUser.id, input)

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
    console.error('Change password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
