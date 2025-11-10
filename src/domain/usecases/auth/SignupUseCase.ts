import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ValidationError, AuthenticationError } from "../../errors";

/**
 * Sign up Use Case
 * Business logic for user registration
 * Independent of framework and database
 */
export class SignupUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: SignupInput): Promise<User> {
    // Validate input
    this.validateInput(input);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AuthenticationError("User with this email already exists");
    }

    // Create new user
    // Note: Password hashing should be done in the data layer
    const user = new User(
      this.generateId(),
      input.email,
      input.password, // This should be hashed in repository
      input.firstName,
      input.lastName
    );

    return await this.userRepository.create(user);
  }

  private validateInput(input: SignupInput): void {
    if (!input.email || !this.isValidEmail(input.email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!input.password || input.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    if (input.firstName && input.firstName.trim().length === 0) {
      throw new ValidationError("First name cannot be empty");
    }

    if (input.lastName && input.lastName.trim().length === 0) {
      throw new ValidationError("Last name cannot be empty");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    // This will be replaced by repository/database
    return `user_${Date.now()}`;
  }
}

export interface SignupInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
