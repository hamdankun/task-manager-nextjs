import { FilterTasksByStatusUseCase, type FilterTasksInput } from '@domain/usecases'
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

describe('FilterTasksByStatusUseCase', () => {
  let useCase: FilterTasksByStatusUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    useCase = new FilterTasksByStatusUseCase(mockRepository)
  })

  describe('execute', () => {
    it('should filter tasks by TODO status', async () => {
      const todoTask1 = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const todoTask2 = new Task('task-2', 'Clean house', 'user-1', TaskStatus.TODO)
      const inProgressTask = new Task('task-3', 'Walk dog', 'user-1', TaskStatus.IN_PROGRESS)
      const doneTask = new Task('task-4', 'Read book', 'user-1', TaskStatus.DONE)

      await mockRepository.create(todoTask1)
      await mockRepository.create(todoTask2)
      await mockRepository.create(inProgressTask)
      await mockRepository.create(doneTask)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.TODO,
      }

      const result = await useCase.execute(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === TaskStatus.TODO)).toBe(true)
      expect(result.map((t) => t.id)).toContain('task-1')
      expect(result.map((t) => t.id)).toContain('task-2')
    })

    it('should filter tasks by IN_PROGRESS status', async () => {
      const todoTask = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const inProgressTask1 = new Task('task-2', 'Clean house', 'user-1', TaskStatus.IN_PROGRESS)
      const inProgressTask2 = new Task('task-3', 'Walk dog', 'user-1', TaskStatus.IN_PROGRESS)
      const doneTask = new Task('task-4', 'Read book', 'user-1', TaskStatus.DONE)

      await mockRepository.create(todoTask)
      await mockRepository.create(inProgressTask1)
      await mockRepository.create(inProgressTask2)
      await mockRepository.create(doneTask)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.IN_PROGRESS,
      }

      const result = await useCase.execute(input)

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === TaskStatus.IN_PROGRESS)).toBe(true)
    })

    it('should filter tasks by DONE status', async () => {
      const todoTask = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const inProgressTask = new Task('task-2', 'Clean house', 'user-1', TaskStatus.IN_PROGRESS)
      const doneTask1 = new Task('task-3', 'Walk dog', 'user-1', TaskStatus.DONE)
      const doneTask2 = new Task('task-4', 'Read book', 'user-1', TaskStatus.DONE)

      await mockRepository.create(todoTask)
      await mockRepository.create(inProgressTask)
      await mockRepository.create(doneTask1)
      await mockRepository.create(doneTask2)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.DONE,
      }

      const result = await useCase.execute(input)

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === TaskStatus.DONE)).toBe(true)
    })

    it('should return empty array when no tasks match status', async () => {
      const todoTask = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      await mockRepository.create(todoTask)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.DONE,
      }

      const result = await useCase.execute(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(0)
    })

    it('should filter by status only for specified user', async () => {
      const user1TodoTask1 = new Task('task-1', 'Task 1', 'user-1', TaskStatus.TODO)
      const user1TodoTask2 = new Task('task-2', 'Task 2', 'user-1', TaskStatus.TODO)
      const user2TodoTask1 = new Task('task-3', 'Task 3', 'user-2', TaskStatus.TODO)
      const user2TodoTask2 = new Task('task-4', 'Task 4', 'user-2', TaskStatus.TODO)

      await mockRepository.create(user1TodoTask1)
      await mockRepository.create(user1TodoTask2)
      await mockRepository.create(user2TodoTask1)
      await mockRepository.create(user2TodoTask2)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.TODO,
      }

      const result = await useCase.execute(input)

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.userId === 'user-1')).toBe(true)
      expect(result.every((t) => t.status === TaskStatus.TODO)).toBe(true)
    })
  })

  describe('validation', () => {
    it('should throw ValidationError when user ID is empty', async () => {
      const input: FilterTasksInput = {
        userId: '',
        status: TaskStatus.TODO,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(useCase.execute(input)).rejects.toThrow('User ID is required')
    })

    it('should throw ValidationError when user ID is whitespace', async () => {
      const input: FilterTasksInput = {
        userId: '   ',
        status: TaskStatus.TODO,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when status is invalid', async () => {
      const input: FilterTasksInput = {
        userId: 'user-1',
        status: 'INVALID_STATUS' as any,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when status is empty string', async () => {
      const input: FilterTasksInput = {
        userId: 'user-1',
        status: '' as any,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when status is undefined', async () => {
      const input = {
        userId: 'user-1',
        status: undefined as any,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError when user ID is undefined', async () => {
      const input = {
        userId: undefined as any,
        status: TaskStatus.TODO,
      }

      await expect(useCase.execute(input)).rejects.toThrow(ValidationError)
    })

    it('should validate status is one of valid enum values', async () => {
      // Test with all valid statuses
      const validStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]

      for (const status of validStatuses) {
        const input: FilterTasksInput = {
          userId: 'user-1',
          status,
        }

        // Should not throw
        await useCase.execute(input)
      }
    })
  })

  describe('multi-user filtering', () => {
    it('should not leak other users tasks with same status', async () => {
      const user1TodoTask = new Task('task-1', 'User 1 TODO', 'user-1', TaskStatus.TODO)
      const user2TodoTask = new Task('task-2', 'User 2 TODO', 'user-2', TaskStatus.TODO)

      await mockRepository.create(user1TodoTask)
      await mockRepository.create(user2TodoTask)

      const result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result).toHaveLength(1)
      expect(result[0].userId).toBe('user-1')
      expect(result[0].id).toBe('task-1')
    })

    it('should filter correctly when users have different status distributions', async () => {
      // User 1: 10 TODO, 2 IN_PROGRESS, 1 DONE
      for (let i = 0; i < 10; i++) {
        await mockRepository.create(new Task(`user1-todo-${i}`, `Task ${i}`, 'user-1', TaskStatus.TODO))
      }
      for (let i = 0; i < 2; i++) {
        await mockRepository.create(new Task(`user1-progress-${i}`, `Task ${i}`, 'user-1', TaskStatus.IN_PROGRESS))
      }
      await mockRepository.create(new Task('user1-done-0', 'Done task', 'user-1', TaskStatus.DONE))

      // User 2: 1 TODO, 5 IN_PROGRESS, 10 DONE
      await mockRepository.create(new Task('user2-todo-0', 'Task 0', 'user-2', TaskStatus.TODO))
      for (let i = 0; i < 5; i++) {
        await mockRepository.create(new Task(`user2-progress-${i}`, `Task ${i}`, 'user-2', TaskStatus.IN_PROGRESS))
      }
      for (let i = 0; i < 10; i++) {
        await mockRepository.create(new Task(`user2-done-${i}`, `Task ${i}`, 'user-2', TaskStatus.DONE))
      }

      // User 1 should get 10 TODO tasks
      const user1TodoResult = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })
      expect(user1TodoResult).toHaveLength(10)
      expect(user1TodoResult.every((t) => t.userId === 'user-1')).toBe(true)

      // User 2 should get 10 DONE tasks
      const user2DoneResult = await useCase.execute({
        userId: 'user-2',
        status: TaskStatus.DONE,
      })
      expect(user2DoneResult).toHaveLength(10)
      expect(user2DoneResult.every((t) => t.userId === 'user-2')).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle tasks with special characters when filtering', async () => {
      const task = new Task('task-1', 'Buy 🍎 & 🥕', 'user-1', TaskStatus.TODO)
      await mockRepository.create(task)

      const result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Buy 🍎 & 🥕')
    })

    it('should handle filtering with very long descriptions', async () => {
      const longDescription = 'A'.repeat(1000)
      const task = new Task('task-1', 'Task', 'user-1', TaskStatus.TODO, longDescription)
      await mockRepository.create(task)

      const result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result).toHaveLength(1)
      expect(result[0].description).toBe(longDescription)
    })

    it('should return new array instance each call', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      await mockRepository.create(task)

      const result1 = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })
      const result2 = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result1).not.toBe(result2)
      expect(result1).toEqual(result2)
    })

    it('should handle case-sensitive status matching', async () => {
      const task = new Task('task-1', 'Task', 'user-1', TaskStatus.TODO)
      await mockRepository.create(task)

      const input: FilterTasksInput = {
        userId: 'user-1',
        status: TaskStatus.TODO,
      }

      const result = await useCase.execute(input)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(TaskStatus.TODO)
    })
  })

  describe('filtering consistency', () => {
    it('should return same results for consecutive calls', async () => {
      const task1 = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const task2 = new Task('task-2', 'Clean house', 'user-1', TaskStatus.TODO)

      await mockRepository.create(task1)
      await mockRepository.create(task2)

      const result1 = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })
      const result2 = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result1.map((t) => t.id)).toEqual(result2.map((t) => t.id))
    })

    it('should correctly handle task updates in filtering', async () => {
      const task1 = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO)
      const task2 = new Task('task-2', 'Clean house', 'user-1', TaskStatus.IN_PROGRESS)
      
      await mockRepository.create(task1)
      await mockRepository.create(task2)

      // Filter by TODO - should return task1
      let result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('task-1')

      // Update task1 to IN_PROGRESS
      const updatedTask1 = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.IN_PROGRESS)
      await mockRepository.update(updatedTask1)

      // Filter by TODO should now return empty
      result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })
      expect(result).toHaveLength(0)

      // Filter by IN_PROGRESS should return both tasks
      result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.IN_PROGRESS,
      })
      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === TaskStatus.IN_PROGRESS)).toBe(true)
    })
  })

  describe('data integrity', () => {
    it('should not modify tasks during filtering', async () => {
      const task = new Task('task-1', 'Original title', 'user-1', TaskStatus.TODO, 'Original description')
      const originalTitle = task.title
      const originalDescription = task.description

      await mockRepository.create(task)

      const result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      expect(result[0].title).toBe(originalTitle)
      expect(result[0].description).toBe(originalDescription)
    })

    it('should preserve all task properties after filtering', async () => {
      const task = new Task('task-1', 'Buy groceries', 'user-1', TaskStatus.TODO, 'Get vegetables')
      const createdAtBefore = task.createdAt
      await mockRepository.create(task)

      const result = await useCase.execute({
        userId: 'user-1',
        status: TaskStatus.TODO,
      })

      const filteredTask = result[0]
      expect(filteredTask.id).toBe('task-1')
      expect(filteredTask.title).toBe('Buy groceries')
      expect(filteredTask.description).toBe('Get vegetables')
      expect(filteredTask.status).toBe(TaskStatus.TODO)
      expect(filteredTask.userId).toBe('user-1')
      expect(filteredTask.createdAt).toEqual(createdAtBefore)
    })
  })
})
