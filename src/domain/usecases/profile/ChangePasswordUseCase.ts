/**
 * ChangePasswordUseCase
 *
 * Business logic for changing user password
 * Domain layer - Pure business logic, no framework dependencies
 */

import { ValidationError, AuthenticationError } from '@domain/errors'
import { User } from '@domain/entities'
import type { IUserRepository } from '@domain/repositories'
import type { IPasswordService } from '@domain/usecases'

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export class ChangePasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(userId: string, input: ChangePasswordInput): Promise<void> {
    // Validation rules
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError('User ID is required')
    }

    if (!input.currentPassword) {
      throw new ValidationError('Current password is required')
    }

    if (!input.newPassword || input.newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters')
    }

    if (input.newPassword !== input.confirmPassword) {
      throw new ValidationError('Passwords do not match')
    }

    if (input.newPassword === input.currentPassword) {
      throw new ValidationError(
        'New password must be different from current password'
      )
    }

    // Get user
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ValidationError('User not found')
    }

    // Verify current password
    const isPasswordValid = await this.passwordService.compare(
      input.currentPassword,
      user.password
    )

    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hash(input.newPassword)

    // Create new user instance with updated password
    const updatedUser = new User(
      user.id,
      user.email,
      hashedPassword,
      user.firstName,
      user.lastName
    )

    // Update user with new password
    await this.userRepository.update(updatedUser)
  }
}
