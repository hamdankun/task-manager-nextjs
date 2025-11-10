import { User as DomainUser } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { IPasswordService } from "@domain/usecases";
import { prisma } from "@data/datasources/prisma";
import { UserMapper } from "@data/mappers/UserMapper";

/**
 * UserRepository
 * Implements the IUserRepository interface
 * Handles all user data operations using Prisma ORM
 * Follows Clean Architecture by implementing domain interface
 */
export class UserRepository implements IUserRepository {
  constructor(private passwordService: IPasswordService) {}

  /**
   * Create a new user
   * @param user Domain User entity
   * @returns Promise<DomainUser> Created user
   */
  async create(user: DomainUser): Promise<DomainUser> {
    // Hash the password before storing
    const hashedPassword = await this.passwordService.hash(user.password);

    // Create user in database
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
      },
    });

    // Map back to domain entity
    return UserMapper.toDomain(createdUser);
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns Promise<DomainUser | null> User if found, null otherwise
   */
  async findById(id: string): Promise<DomainUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  /**
   * Find user by email
   * @param email User email
   * @returns Promise<DomainUser | null> User if found, null otherwise
   */
  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  /**
   * Update user
   * @param user Domain User entity with updated fields
   * @returns Promise<DomainUser> Updated user
   */
  async update(user: DomainUser): Promise<DomainUser> {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
      },
    });

    return UserMapper.toDomain(updatedUser);
  }

  /**
   * Delete user by ID
   * @param id User ID
   * @returns Promise<boolean> True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // User not found
      return false;
    }
  }

  /**
   * Check if user exists by email
   * @param email User email
   * @returns Promise<boolean> True if user exists, false otherwise
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user !== null;
  }
}
