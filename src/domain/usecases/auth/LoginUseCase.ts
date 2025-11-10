import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";
import { ValidationError, AuthenticationError } from "../../errors";

/**
 * Login Use Case
 * Business logic for user authentication
 * Independent of framework and database
 */
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(input: LoginInput): Promise<User> {
    // Validate input
    this.validateInput(input);

    // Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    return user;
  }

  private validateInput(input: LoginInput): void {
    if (!input.email || input.email.trim().length === 0) {
      throw new ValidationError("Email is required");
    }

    if (!input.password || input.password.length === 0) {
      throw new ValidationError("Password is required");
    }
  }
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
