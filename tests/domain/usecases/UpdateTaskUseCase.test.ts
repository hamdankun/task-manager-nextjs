import { UpdateTaskUseCase, type UpdateTaskInput } from '@domain/usecases'
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

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    useCase = new UpdateTaskUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should update task title successfully', async () => {
      const task = new Task('task-1', 'Old Title', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'New Title',
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe('New Title')
      expect(result.id).toBe('task-1')
      expect(result.userId).toBe('user-1')
    })

    it('should update task description successfully', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, 'Old description')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        description: 'Buy milk and eggs',
      }

      const result = await useCase.execute(input)

      expect(result.description).toBe('Buy milk and eggs')
      expect(result.title).toBe('Buy groceries')
    })

    it('should update task status successfully', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        status: TaskStatus.IN_PROGRESS,
      }

      const result = await useCase.execute(input)

      expect(result.status).toBe(TaskStatus.IN_PROGRESS)
    })

    it('should update multiple task fields at once', async () => {
      const task = new Task('task-1', 'Old Title', 'user-1', TaskStatus.TODO, 'Old description')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'New Title',
        description: 'New description',
        status: TaskStatus.DONE,
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe('New Title')
      expect(result.description).toBe('New description')
      expect(result.status).toBe(TaskStatus.DONE)
    })

    it('should preserve original fields not in update', async () => {
      const original = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, 'Buy milk and eggs')
      await mockRepository.create(original)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'New Title',
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe('New Title')
      expect(result.description).toBe('Buy milk and eggs')
      expect(result.status).toBe(TaskStatus.TODO)
    })

    it('should throw ValidationError when task ID is empty', async () => {
      const input: UpdateTaskInput = {
        id: '',
        userId: 'user-1',
        title: 'New Title',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Task ID is required')
    })

    it('should throw ValidationError when user ID is empty', async () => {
      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: '',
        title: 'New Title',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('User ID is required')
    })

    it('should throw ValidationError when title is empty string', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: '   ',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Task title cannot be empty')
    })

    it('should throw ValidationError when title exceeds max length', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'a'.repeat(256),
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Task title must be less than 255 characters')
    })

    it('should throw ValidationError when description exceeds max length', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        description: 'a'.repeat(5001),
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Task description must be less than 5000 characters')
    })

    it('should throw ValidationError when status is invalid', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        status: 'invalid_status',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('Invalid task status')
    })

    it('should throw NotFoundError when task does not exist', async () => {
      const input: UpdateTaskInput = {
        id: 'nonexistent-task',
        userId: 'user-1',
        title: 'New Title',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
    })

    it('should throw NotFoundError when task does not belong to user', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'different-user',
        title: 'New Title',
      }

      await expect(useCase.execute(input)).rejects.toThrow(NotFoundError)
    })

    it('should allow updating task with maximum valid title length', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const maxTitle = 'a'.repeat(255) // Exactly 255 characters
      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: maxTitle,
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe(maxTitle)
      expect(result.title.length).toBe(255)
    })

    it('should allow updating task with maximum valid description length', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const maxDescription = 'a'.repeat(5000) // Exactly 5000 characters
      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        description: maxDescription,
      }

      const result = await useCase.execute(input)

      expect(result.description).toBe(maxDescription)
      expect(result.description?.length).toBe(5000)
    })

    it('should update updatedAt timestamp on update', async () => {
      const originalTime = new Date('2024-01-01')
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, undefined, originalTime, originalTime)
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'New Title',
      }

      const result = await useCase.execute(input)

      expect(result.updatedAt).not.toBe(originalTime)
      expect(result.updatedAt?.getTime()).toBeGreaterThan(originalTime.getTime())
    })

    it('should handle status transitions from TODO to IN_PROGRESS', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        status: TaskStatus.IN_PROGRESS,
      }

      const result = await useCase.execute(input)

      expect(result.status).toBe(TaskStatus.IN_PROGRESS)
    })

    it('should handle status transitions from IN_PROGRESS to DONE', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.IN_PROGRESS)
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        status: TaskStatus.DONE,
      }

      const result = await useCase.execute(input)

      expect(result.status).toBe(TaskStatus.DONE)
    })

    it('should preserve createdAt timestamp on update', async () => {
      const createdAt = new Date('2024-01-01')
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, undefined, createdAt, createdAt)
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'New Title',
      }

      const result = await useCase.execute(input)

      expect(result.createdAt).toBe(createdAt)
    })

    it('should allow clearing task description', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, 'Buy milk and eggs')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        description: '',
      }

      const result = await useCase.execute(input)

      expect(result.description).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid successive updates', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const updates = [
        { title: 'Update 1', status: TaskStatus.IN_PROGRESS },
        { title: 'Update 2', status: TaskStatus.DONE },
        { title: 'Update 3', status: TaskStatus.TODO },
      ]

      for (const update of updates) {
        const input: UpdateTaskInput = {
          id: 'task-1',
          userId: 'user-1',
          ...update,
        }
        await useCase.execute(input)
      }

      const final = await mockRepository.findById('task-1')
      expect(final?.title).toBe('Update 3')
      expect(final?.status).toBe(TaskStatus.TODO)
    })

    it('should handle unicode characters in title and description', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const input: UpdateTaskInput = {
        id: 'task-1',
        userId: 'user-1',
        title: 'Acheter des épiceries 🛒',
        description: 'Comprer leche, huevos y pan 📦',
      }

      const result = await useCase.execute(input)

      expect(result.title).toBe('Acheter des épiceries 🛒')
      expect(result.description).toBe('Comprer leche, huevos y pan 📦')
    })
  })
})
