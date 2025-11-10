import * as bcrypt from "bcrypt";
import { IPasswordService } from "@domain/usecases";

/**
 * PasswordService
 * Handles password hashing and verification
 * Used by repositories and use cases
 */
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  /**
   * Hash a plain text password
   * @param password Plain text password
   * @returns Promise<string> Hashed password
   */
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare plain text password with hashed password
   * @param password Plain text password
   * @param hashedPassword Hashed password from database
   * @returns Promise<boolean> True if passwords match
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
