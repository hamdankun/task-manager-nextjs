import { DeleteTaskUseCase, type DeleteTaskInput } from '@domain/usecases'
import { Task, TaskStatus } from '@domain/entities'
import { ValidationError, NotFoundError } from '@domain/errors'
import { ITaskRepository } from '@domain/repositories'

// Mock repository for testing
class MockTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map()

  async create(task: Task): Promise<Task> {
    this.tasks.set(task.id, task)
    return task
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.userId === userId)
  }

  async findByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.userId === userId && t.status === status)
  }

  async update(task: Task): Promise<Task> {
    this.tasks.set(task.id, task)
    return task
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.tasks.has(id)
  }

  async belongsToUser(taskId: string, userId: string): Promise<boolean> {
    const task = this.tasks.get(taskId)
    return task ? task.userId === userId : false
  }
}

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    useCase = new DeleteTaskUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should delete task successfully', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'user-1',
      }

      const result = await useCase.execute(input)

      expect(result).toBe(true)
      expect(await mockRepository.findById('task-1')).toBeNull()
    })

    it('should return true when task is deleted', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'user-1',
      }

      const result = await useCase.execute(input)

      expect(typeof result).toBe('boolean')
      expect(result).toBe(true)
    })

    it('should not delete task belonging to different user', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'different-user',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
    })

    it('should throw ValidationError when task ID is empty', async () => {
      const input: DeleteTaskInput = {
        id: '',
        userId: 'user-1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Task ID is required')
    })

    it('should throw ValidationError when task ID is whitespace', async () => {
      const input: DeleteTaskInput = {
        id: '   ',
        userId: 'user-1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when user ID is empty', async () => {
      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('User ID is required')
    })

    it('should throw ValidationError when user ID is whitespace', async () => {
      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: '   ',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw NotFoundError when task does not exist', async () => {
      const input: DeleteTaskInput = {
        id: 'nonexistent-task',
        userId: 'user-1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
    })

    it('should verify ownership before deletion', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'user-2',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
      // Task should still exist since deletion was prevented
      expect(await mockRepository.findById('task-1')).not.toBeNull()
    })
  })

  describe('multiple deletions', () => {
    it('should delete multiple tasks for same user', async () => {
      const task1 = new Task('task-1', 'Buy groceries', 'user-1')
      const task2 = new Task('task-2', 'Clean house', 'user-1')
      const task3 = new Task('task-3', 'Walk dog', 'user-1')

      await mockRepository.create(task1)
      await mockRepository.create(task2)
      await mockRepository.create(task3)

      // Delete first task
      await useCase.execute({
        id: 'task-1',
        userId: 'user-1',
      })

      expect(await mockRepository.findById('task-1')).toBeNull()
      expect(await mockRepository.findById('task-2')).not.toBeNull()
      expect(await mockRepository.findById('task-3')).not.toBeNull()

      // Delete second task
      await useCase.execute({
        id: 'task-2',
        userId: 'user-1',
      })

      expect(await mockRepository.findById('task-2')).toBeNull()
      expect(await mockRepository.findById('task-3')).not.toBeNull()
    })

    it('should not affect other users tasks', async () => {
      const user1Task = new Task('task-1', 'Buy groceries', 'user-1')
      const user2Task = new Task('task-2', 'Buy groceries', 'user-2')

      await mockRepository.create(user1Task)
      await mockRepository.create(user2Task)

      // Delete user1 task
      await useCase.execute({
        id: 'task-1',
        userId: 'user-1',
      })

      expect(await mockRepository.findById('task-1')).toBeNull()
      expect(await mockRepository.findById('task-2')).not.toBeNull()
    })
  })

  describe('edge cases', () => {
    it('should handle deletion of task with various statuses', async () => {
      const todoTask = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const inProgressTask = new Task('task-2', 'Clean house', 'user-1', TaskStatus.IN_PROGRESS)
      const doneTask = new Task('task-3', 'Walk dog', 'user-1', TaskStatus.DONE)

      await mockRepository.create(todoTask)
      await mockRepository.create(inProgressTask)
      await mockRepository.create(doneTask)

      const result1 = await useCase.execute({ id: 'task-1', userId: 'user-1' })
      const result2 = await useCase.execute({ id: 'task-2', userId: 'user-1' })
      const result3 = await useCase.execute({ id: 'task-3', userId: 'user-1' })

      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
    })

    it('should handle deletion of task with special characters in ID', async () => {
      const specialId = 'task_@#$-123'
      const task = new Task(specialId, 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const result = await useCase.execute({
        id: specialId,
        userId: 'user-1',
      })

      expect(result).toBe(true)
      expect(await mockRepository.findById(specialId)).toBeNull()
    })

    it('should prevent idempotent deletion of same task', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      // First deletion succeeds
      const result1 = await useCase.execute({
        id: 'task-1',
        userId: 'user-1',
      })

      expect(result1).toBe(true)

      // Second deletion attempts should fail
      await expect(
        useCase.execute({
          id: 'task-1',
          userId: 'user-1',
        })
      ).rejects.toThrow(NotFoundError)
    })
  })

  describe('security', () => {
    it('should enforce user ownership check', async () => {
      const task = new Task('task-1', 'Confidential task', 'user-1')
      await mockRepository.create(task)

      // User 2 should not be able to delete user 1's task
      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'user-2',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)

      // Task should still exist
      expect(await mockRepository.findById('task-1')).not.toBeNull()
    })

    it('should not delete based on task ID alone', async () => {
      const task1 = new Task('task-1', 'User 1 task', 'user-1')
      const task2 = new Task('task-1', 'User 2 task', 'user-2') // Same logical ID but different user

      await mockRepository.create(task1)
      // Note: In a real DB this would be different, but for testing we show the concept

      const input: DeleteTaskInput = {
        id: 'task-1',
        userId: 'user-2',
      }

      // Should not find task for user-2
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
    })
  })
})
