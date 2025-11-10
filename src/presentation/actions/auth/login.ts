"use server";

import { LoginUseCase, type LoginInput } from "@domain/usecases";
import { AppError } from "@domain/errors";
import { UserRepository } from "@data/repositories";
import { PasswordService } from "@data/services";
import { cookies } from "next/headers";

/**
 * Login Server Action
 * Entry point for user authentication
 * Follows Clean Architecture by:
 * 1. Using domain use case for business logic
 * 2. Using repository for data access
 * 3. Handling errors from domain layer
 * 4. Returning type-safe responses
 * 5. Setting secure HTTP-only cookies for session
 */
export async function loginAction(input: LoginInput): Promise<{
  success: boolean;
  data?: { id: string; email: string; fullName: string };
  error?: string;
}> {
  try {
    // Instantiate dependencies
    const passwordService = new PasswordService();
    const userRepository = new UserRepository(passwordService);

    // Create and execute use case
    const loginUseCase = new LoginUseCase(userRepository, passwordService);
    const user = await loginUseCase.execute(input);

    // Set secure HTTP-only cookie with user data
    const cookieStore = await cookies();
    cookieStore.set("auth_user", JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

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
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
