import { CreateTaskUseCase } from '@domain/usecases'
import { Task, TaskStatus } from '@domain/entities'
import { ValidationError } from '@domain/errors'
import { ITaskRepository } from '@domain/repositories'

// Mock repository
class MockTaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    return task
  }

  async findById(id: string): Promise<Task | null> {
    return null
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return []
  }

  async findByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return []
  }

  async update(task: Task): Promise<Task> {
    return task
  }

  async delete(id: string): Promise<boolean> {
    return true
  }

  async exists(id: string): Promise<boolean> {
    return false
  }

  async belongsToUser(taskId: string, userId: string): Promise<boolean> {
    return true
  }
}

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    useCase = new CreateTaskUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should create a task successfully with valid input', async () => {
      const input = {
        title: 'Buy groceries',
        userId: 'user-1',
      }

      const result = await useCase.execute(input)

      expect(result).toBeInstanceOf(Task)
      expect(result.title).toBe('Buy groceries')
      expect(result.userId).toBe('user-1')
      expect(result.status).toBe(TaskStatus.TODO)
    })

    it('should create a task with description when provided', async () => {
      const input = {
        title: 'Buy groceries',
        userId: 'user-1',
        description: 'Buy milk, eggs, and bread',
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe('Buy groceries')
      expect(result.description).toBe('Buy milk, eggs, and bread')
    })

    it('should throw ValidationError when title is empty', async () => {
      const input = {
        title: '',
        userId: 'user-1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when title exceeds max length', async () => {
      const input = {
        title: 'a'.repeat(256),
        userId: 'user-1',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when userId is empty', async () => {
      const input = {
        title: 'Buy groceries',
        userId: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when description exceeds max length', async () => {
      const input = {
        title: 'Buy groceries',
        userId: 'user-1',
        description: 'a'.repeat(5001),
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })
  })
})
