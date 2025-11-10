import { Task as DomainTask, TaskStatus } from '@domain/entities'

interface PrismaTask {
  id: string
  title: string
  description: string | null
  status: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * TaskMapper
 * Maps between Prisma Task model and Domain Task entity
 * Follows Clean Architecture by separating data layer concerns from domain
 */
export class TaskMapper {
  /**
   * Convert Prisma Task to Domain Task Entity
   */
  static toDomain(prismaTask: PrismaTask): DomainTask {
    return new DomainTask(
      prismaTask.id,
      prismaTask.title,
      prismaTask.userId,
      (prismaTask.status as TaskStatus) || TaskStatus.TODO,
      prismaTask.description || undefined,
      prismaTask.createdAt,
      prismaTask.updatedAt
    )
  }

  /**
   * Convert Domain Task Entity to Prisma Task (for persistence)
   */
  static toPersistence(domainTask: DomainTask) {
    return {
      id: domainTask.id,
      title: domainTask.title,
      description: domainTask.description || null,
      status: domainTask.status,
      userId: domainTask.userId,
      createdAt: domainTask.createdAt,
      updatedAt: domainTask.updatedAt,
    }
  }
}
