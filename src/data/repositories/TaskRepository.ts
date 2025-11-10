import { Task as DomainTask, TaskStatus } from '@domain/entities'
import { ITaskRepository } from '@domain/repositories'
import { TaskMapper } from '@data/mappers'
import { prisma } from '@data/datasources/prisma'
import { NotFoundError } from '@domain/errors'

/**
 * TaskRepository
 * Implements ITaskRepository interface
 * Handles all task data operations using Prisma ORM
 * Maps between Prisma and Domain entities
 */
export class TaskRepository implements ITaskRepository {
  /**
   * Create a new task
   */
  async create(task: DomainTask): Promise<DomainTask> {
    try {
      const persistenceTask = TaskMapper.toPersistence(task)
      const createdTask = await prisma.task.create({
        data: persistenceTask,
      })
      return TaskMapper.toDomain(createdTask)
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  /**
   * Find task by ID
   */
  async findById(id: string): Promise<DomainTask | null> {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
      })
      return task ? TaskMapper.toDomain(task) : null
    } catch (error) {
      console.error('Error finding task by ID:', error)
      throw error
    }
  }

  /**
   * Find all tasks for a user
   */
  async findByUserId(userId: string): Promise<DomainTask[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
      return tasks.map((task) => TaskMapper.toDomain(task))
    } catch (error) {
      console.error('Error finding tasks by user ID:', error)
      throw error
    }
  }

  /**
   * Find tasks for a user filtered by status
   */
  async findByUserIdAndStatus(userId: string, status: TaskStatus): Promise<DomainTask[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
          status,
        },
        orderBy: { createdAt: 'desc' },
      })
      return tasks.map((task) => TaskMapper.toDomain(task))
    } catch (error) {
      console.error('Error finding tasks by user ID and status:', error)
      throw error
    }
  }

  /**
   * Update task
   */
  async update(task: DomainTask): Promise<DomainTask> {
    try {
      const persistenceTask = TaskMapper.toPersistence(task)
      const updatedTask = await prisma.task.update({
        where: { id: task.id },
        data: persistenceTask,
      })
      return TaskMapper.toDomain(updatedTask)
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  /**
   * Delete task by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  /**
   * Check if task exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
      })
      return !!task
    } catch (error) {
      console.error('Error checking if task exists:', error)
      return false
    }
  }

  /**
   * Check if task belongs to user
   */
  async belongsToUser(taskId: string, userId: string): Promise<boolean> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      })
      return task ? task.userId === userId : false
    } catch (error) {
      console.error('Error checking if task belongs to user:', error)
      return false
    }
  }
}
