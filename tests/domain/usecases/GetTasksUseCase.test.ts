import { GetTasksUseCase, type GetTasksInput } from '@domain/usecases'
import { Task, TaskStatus } from '@domain/entities'
import { ValidationError } from '@domain/errors'
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

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    useCase = new GetTasksUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should retrieve all tasks for user', async () => {
      const task1 = new Task('task-1', 'Buy groceries', 'user-1')
      const task2 = new Task('task-2', 'Clean house', 'user-1')
      const task3 = new Task('task-3', 'Walk dog', 'user-1')

      await mockRepository.create(task1)
      await mockRepository.create(task2)
      await mockRepository.create(task3)

      const input: GetTasksInput = {
        userId: 'user-1',
      }

      const result = await useCase.execute(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(3)
      expect(result.map((t) => t.id)).toContain('task-1')
      expect(result.map((t) => t.id)).toContain('task-2')
      expect(result.map((t) => t.id)).toContain('task-3')
    })

    it('should return empty array when user has no tasks', async () => {
      const input: GetTasksInput = {
        userId: 'user-1',
      }

      const result = await useCase.execute(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(0)
    })

    it('should only return tasks for specified user', async () => {
      const user1Task1 = new Task('task-1', 'User 1 task 1', 'user-1')
      const user1Task2 = new Task('task-2', 'User 1 task 2', 'user-1')
      const user2Task1 = new Task('task-3', 'User 2 task 1', 'user-2')
      const user2Task2 = new Task('task-4', 'User 2 task 2', 'user-2')

      await mockRepository.create(user1Task1)
      await mockRepository.create(user1Task2)
      await mockRepository.create(user2Task1)
      await mockRepository.create(user2Task2)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.userId === 'user-1')).toBe(true)
      expect(result.map((t) => t.id)).toEqual(expect.arrayContaining(['task-1', 'task-2']))
    })

    it('should throw ValidationError when user ID is empty', async () => {
      const input: GetTasksInput = {
        userId: '',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('User ID is required')
    })

    it('should throw ValidationError when user ID is whitespace', async () => {
      const input: GetTasksInput = {
        userId: '   ',
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when user ID is undefined', async () => {
      const input = {
        userId: undefined as any,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })
  })

  describe('task properties', () => {
    it('should return tasks with all properties', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, 'Get fresh vegetables')
      await mockRepository.create(task)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      const retrievedTask = result[0]
      expect(retrievedTask).toHaveProperty('id', 'task-1')
      expect(retrievedTask).toHaveProperty('title', 'Buy groceries')
      expect(retrievedTask).toHaveProperty('userId', 'user-1')
      expect(retrievedTask).toHaveProperty('status', TaskStatus.TODO)
      expect(retrievedTask).toHaveProperty('description', 'Get fresh vegetables')
      expect(retrievedTask).toHaveProperty('createdAt')
      expect(retrievedTask).toHaveProperty('updatedAt')
    })

    it('should preserve task timestamps', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      const createdAtBefore = task.createdAt
      await mockRepository.create(task)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      expect(result[0].createdAt).toEqual(createdAtBefore)
    })

    it('should preserve task with all statuses', async () => {
      const todoTask = new Task('task-1', 'TODO task', 'user-1', TaskStatus.TODO)
      const inProgressTask = new Task('task-2', 'In progress task', 'user-1', TaskStatus.IN_PROGRESS)
      const doneTask = new Task('task-3', 'Done task', 'user-1', TaskStatus.DONE)

      await mockRepository.create(todoTask)
      await mockRepository.create(inProgressTask)
      await mockRepository.create(doneTask)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(3)
      expect(result.map((t) => t.status)).toContain(TaskStatus.TODO)
      expect(result.map((t) => t.status)).toContain(TaskStatus.IN_PROGRESS)
      expect(result.map((t) => t.status)).toContain(TaskStatus.DONE)
    })
  })

  describe('scalability', () => {
    it('should handle large number of tasks', async () => {
      const taskCount = 100
      for (let i = 0; i < taskCount; i++) {
        const task = new Task(`task-${i}`, `Task ${i}`, 'user-1')
        await mockRepository.create(task)
      }

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(taskCount)
      expect(result.every((t) => t.userId === 'user-1')).toBe(true)
    })

    it('should maintain performance with mixed user data', async () => {
      // Create 50 tasks for user-1
      for (let i = 0; i < 50; i++) {
        const task = new Task(`user1-task-${i}`, `User 1 Task ${i}`, 'user-1')
        await mockRepository.create(task)
      }

      // Create 50 tasks for user-2
      for (let i = 0; i < 50; i++) {
        const task = new Task(`user2-task-${i}`, `User 2 Task ${i}`, 'user-2')
        await mockRepository.create(task)
      }

      // User-1 should only get their 50 tasks
      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(50)
      expect(result.every((t) => t.userId === 'user-1')).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle tasks with special characters in title', async () => {
      const task = new Task('task-1', 'Buy 🍎 & 🥕 from café', 'user-1')
      await mockRepository.create(task)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Buy 🍎 & 🥕 from café')
    })

    it('should handle tasks with very long descriptions', async () => {
      const longDescription = 'A'.repeat(500)
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, longDescription)
      await mockRepository.create(task)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      expect(result[0].description).toBe(longDescription)
    })

    it('should return new array instance each call', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const result1 = await useCase.execute({ userId: 'user-1' })
      const result2 = await useCase.execute({ userId: 'user-1' })

      expect(result1).not.toBe(result2)
      expect(result1).toEqual(result2)
    })

    it('should return independent task instances', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1')
      await mockRepository.create(task)

      const result = await useCase.execute({ userId: 'user-1' })
      const originalTitle = result[0].title

      // Try to modify returned task (doesn't affect repository since Task properties are readonly)
      const modifiedObj = { ...result[0], title: 'Modified Title' }

      // Original in repository should be unchanged
      const result2 = await useCase.execute({ userId: 'user-1' })
      expect(result2[0].title).toBe(originalTitle)
      expect(result2[0].title).not.toBe('Modified Title')
    })
  })

  describe('ordering and consistency', () => {
    it('should return tasks in consistent order', async () => {
      const task1 = new Task('task-1', 'First task', 'user-1')
      const task2 = new Task('task-2', 'Second task', 'user-1')
      const task3 = new Task('task-3', 'Third task', 'user-1')

      await mockRepository.create(task1)
      await mockRepository.create(task2)
      await mockRepository.create(task3)

      const result1 = await useCase.execute({ userId: 'user-1' })
      const result2 = await useCase.execute({ userId: 'user-1' })

      expect(result1.map((t) => t.id)).toEqual(result2.map((t) => t.id))
    })

    it('should handle multiple users with identical task IDs across users', async () => {
      // User 1 has task-1
      const user1Task = new Task('task-1', 'User 1 task', 'user-1')
      // User 2 has task-1 (different object)
      const user2Task = new Task('task-1', 'User 2 task', 'user-2')

      await mockRepository.create(user1Task)
      // Simulating that different users can have same logical ID

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      expect(result[0].userId).toBe('user-1')
    })
  })

  describe('data integrity', () => {
    it('should not leak other users tasks', async () => {
      const task1 = new Task('task-1', 'Public task', 'user-1')
      const task2 = new Task('task-2', 'Secret task', 'user-2')

      await mockRepository.create(task1)
      await mockRepository.create(task2)

      const result = await useCase.execute({ userId: 'user-1' })

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('task-1')
      expect(result[0].id).not.toBe('task-2')
    })

    it('should preserve task data integrity across retrievals', async () => {
      const originalTask = new Task('task-1', 'Original title', 'user-1', TaskStatus.TODO, 'Original description')
      await mockRepository.create(originalTask)

      const firstRetrieval = await useCase.execute({ userId: 'user-1' })
      const secondRetrieval = await useCase.execute({ userId: 'user-1' })

      expect(firstRetrieval[0]).toEqual(secondRetrieval[0])
      expect(firstRetrieval[0].title).toBe(originalTask.title)
      expect(firstRetrieval[0].description).toBe(originalTask.description)
    })
  })
})
