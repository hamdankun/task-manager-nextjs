import { User as DomainUser } from "@domain/entities";

interface PrismaUser {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserMapper
 * Maps between Prisma User model and Domain User entity
 * Follows Clean Architecture by separating data layer concerns from domain
 */
export class UserMapper {
  /**
   * Convert Prisma User to Domain User Entity
   */
  static toDomain(prismaUser: PrismaUser): DomainUser {
    return new DomainUser(
      prismaUser.id,
      prismaUser.email,
      prismaUser.password,
      prismaUser.firstName || undefined,
      prismaUser.lastName || undefined,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }

  /**
   * Convert Domain User Entity to Prisma User (for persistence)
   */
  static toPersistence(domainUser: DomainUser) {
    return {
      id: domainUser.id,
      email: domainUser.email,
      password: domainUser.password,
      firstName: domainUser.firstName || null,
      lastName: domainUser.lastName || null,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
    };
  }
}
