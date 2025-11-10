'use server'

import { UpdateProfileUseCase, type UpdateProfileInput } from '@domain/usecases'
import { AppError } from '@domain/errors'
import { UserRepository } from '@data/repositories'
import { PasswordService } from '@data/services'
import { getAuthUser } from '@/src/lib/auth'
import { cookies } from 'next/headers'

/**
 * Update Profile Server Action
 *
 * Allows user to update their profile information (name, email)
 * Follows Clean Architecture with dependency injection
 * Updates the authentication cookie after successful profile update
 */
export async function updateProfileAction(input: UpdateProfileInput): Promise<{
  success: boolean
  data?: { id: string; email: string; fullName: string }
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
    const updateProfileUseCase = new UpdateProfileUseCase(userRepository)
    const updatedUser = await updateProfileUseCase.execute(authUser.id, input)

    // Update the authentication cookie with new user data
    const cookieStore = await cookies()
    cookieStore.set('auth_user', JSON.stringify({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.getFullName(),
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
    console.error('Update profile error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
