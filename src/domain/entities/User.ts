/**
 * User Entity - Core business object for authentication
 * Framework independent and database agnostic
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string, // hashed
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Get full name of user
   */
  getFullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || this.email;
  }

  /**
   * Check if user has complete profile
   */
  hasCompleteProfile(): boolean {
    return !!(this.firstName && this.lastName);
  }
}
