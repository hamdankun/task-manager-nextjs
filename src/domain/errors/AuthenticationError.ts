import { AppError } from "./AppError";

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
