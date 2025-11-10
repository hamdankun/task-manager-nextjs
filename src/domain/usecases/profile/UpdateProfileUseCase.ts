/**
 * UpdateProfileUseCase
 *
 * Business logic for updating user profile
 * Domain layer - Pure business logic, no framework dependencies
 */

import { User } from '@domain/entities'
import { ValidationError } from '@domain/errors'
import type { IUserRepository } from '@domain/repositories'

export interface UpdateProfileInput {
  firstName: string
  lastName: string
  email: string
}

export class UpdateProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<User> {
    // Validation rules
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError('User ID is required')
    }

    if (!input.firstName || input.firstName.trim().length < 2) {
      throw new ValidationError('First name must be at least 2 characters')
    }

    if (!input.lastName || input.lastName.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters')
    }

    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new ValidationError('Valid email is required')
    }

    // Check if user exists
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ValidationError('User not found')
    }

    // Update user profile
    const updatedUser = new User(
      user.id,
      input.email,
      user.password, // Password doesn't change in profile update
      input.firstName,
      input.lastName
    )

    await this.userRepository.update(updatedUser)
    return updatedUser
  }
}
