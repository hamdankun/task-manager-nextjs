import { Task, TaskStatus } from '@domain/entities'

describe('Task Entity', () => {
  const taskId = 'task-1'
  const title = 'Buy groceries'
  const userId = 'user-1'
  const description = 'Buy milk, eggs, and bread'

  describe('constructor', () => {
    it('should create a task with required fields', () => {
      const task = new Task(taskId, title, userId)

      expect(task.id).toBe(taskId)
      expect(task.title).toBe(title)
      expect(task.userId).toBe(userId)
      expect(task.status).toBe(TaskStatus.TODO)
      expect(task.description).toBeUndefined()
    })

    it('should create a task with all fields', () => {
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')

      const task = new Task(
        taskId,
        title,
        userId,
        TaskStatus.IN_PROGRESS,
        description,
        createdAt,
        updatedAt
      )

      expect(task.id).toBe(taskId)
      expect(task.title).toBe(title)
      expect(task.userId).toBe(userId)
      expect(task.status).toBe(TaskStatus.IN_PROGRESS)
      expect(task.description).toBe(description)
      expect(task.createdAt).toBe(createdAt)
      expect(task.updatedAt).toBe(updatedAt)
    })
  })

  describe('isCompleted', () => {
    it('should return true when status is DONE', () => {
      const task = new Task(taskId, title, userId, TaskStatus.DONE)
      expect(task.isCompleted()).toBe(true)
    })

    it('should return false when status is TODO', () => {
      const task = new Task(taskId, title, userId, TaskStatus.TODO)
      expect(task.isCompleted()).toBe(false)
    })

    it('should return false when status is IN_PROGRESS', () => {
      const task = new Task(taskId, title, userId, TaskStatus.IN_PROGRESS)
      expect(task.isCompleted()).toBe(false)
    })
  })

  describe('isInProgress', () => {
    it('should return true when status is IN_PROGRESS', () => {
      const task = new Task(taskId, title, userId, TaskStatus.IN_PROGRESS)
      expect(task.isInProgress()).toBe(true)
    })

    it('should return false when status is TODO', () => {
      const task = new Task(taskId, title, userId, TaskStatus.TODO)
      expect(task.isInProgress()).toBe(false)
    })

    it('should return false when status is DONE', () => {
      const task = new Task(taskId, title, userId, TaskStatus.DONE)
      expect(task.isInProgress()).toBe(false)
    })
  })

  describe('canTransitionTo', () => {
    it('should return true for valid status transitions', () => {
      const task = new Task(taskId, title, userId, TaskStatus.TODO)

      expect(task.canTransitionTo(TaskStatus.IN_PROGRESS)).toBe(true)
      expect(task.canTransitionTo(TaskStatus.DONE)).toBe(true)
      expect(task.canTransitionTo(TaskStatus.TODO)).toBe(true)
    })

    it('should return false for invalid status', () => {
      const task = new Task(taskId, title, userId, TaskStatus.TODO)
      // @ts-ignore - intentionally passing invalid status for testing
      expect(task.canTransitionTo('invalid_status')).toBe(false)
    })

    it('should allow transitions from any status to any valid status', () => {
      const todoTask = new Task(taskId, title, userId, TaskStatus.TODO)
      const inProgressTask = new Task(taskId, title, userId, TaskStatus.IN_PROGRESS)
      const doneTask = new Task(taskId, title, userId, TaskStatus.DONE)

      expect(todoTask.canTransitionTo(TaskStatus.IN_PROGRESS)).toBe(true)
      expect(inProgressTask.canTransitionTo(TaskStatus.DONE)).toBe(true)
      expect(doneTask.canTransitionTo(TaskStatus.TODO)).toBe(true)
    })
  })
})
