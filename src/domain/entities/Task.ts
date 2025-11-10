/**
 * Task Entity - Core business object for task management
 * Framework independent and database agnostic
 */
export enum TaskStatus {
  TODO = "to do",
  IN_PROGRESS = "in progress",
  DONE = "done",
}

export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly userId: string,
    public readonly status: TaskStatus = TaskStatus.TODO,
    public readonly description?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  /**
   * Check if task is completed
   */
  isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  /**
   * Check if task is in progress
   */
  isInProgress(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  /**
   * Validate task can be transitioned to new status
   */
  canTransitionTo(newStatus: TaskStatus): boolean {
    // Add business logic for status transitions if needed
    return Object.values(TaskStatus).includes(newStatus);
  }
}
