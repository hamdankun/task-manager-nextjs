import { User } from "../entities/User";

/**
 * User Repository Interface
 * Defines the contract for user data operations
 * Implementation details are in the data layer
 */
export interface IUserRepository {
  /**
   * Create a new user
   */
  create(user: User): Promise<User>;

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Update user
   */
  update(user: User): Promise<User>;

  /**
   * Delete user by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if user exists by email
   */
  existsByEmail(email: string): Promise<boolean>;
}
