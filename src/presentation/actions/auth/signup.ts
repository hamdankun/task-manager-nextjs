"use server";

import { SignupUseCase, type SignupInput } from "@domain/usecases";
import { AppError } from "@domain/errors";
import { UserRepository } from "@data/repositories";
import { PasswordService } from "@data/services";
import { uid } from "uid";

/**
 * Sign up Server Action
 * Entry point for user registration
 * Follows Clean Architecture by:
 * 1. Using domain use case for business logic
 * 2. Using repository for data persistence
 * 3. Handling errors from domain layer
 * 4. Returning type-safe responses
 */
export async function signupAction(input: SignupInput): Promise<{
  success: boolean;
  data?: { id: string; email: string; fullName: string };
  error?: string;
}> {
  try {
    // Instantiate dependencies
    const passwordService = new PasswordService();
    const userRepository = new UserRepository(passwordService);

    // Create and execute use case
    const signupUseCase = new SignupUseCase(userRepository);
    
    // Generate ID for new user
    const userWithId = {
      ...input,
      id: uid(21), // Generate a CUID-like ID
    };

    const user = await signupUseCase.execute(userWithId);

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.getFullName(),
      },
    };
  } catch (error) {
    // Handle domain layer errors
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Handle unexpected errors
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
