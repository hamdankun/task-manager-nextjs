import { Task, TaskStatus } from "../entities/Task";

/**
 * Task Repository Interface
 * Defines the contract for task data operations
 * Implementation details are in the data layer
 */
export interface ITaskRepository {
  /**
   * Create a new task
   */
  create(task: Task): Promise<Task>;

  /**
   * Find task by ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Find all tasks for a user
   */
  findByUserId(userId: string): Promise<Task[]>;

  /**
   * Find tasks for a user filtered by status
   */
  findByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]>;

  /**
   * Update task
   */
  update(task: Task): Promise<Task>;

  /**
   * Delete task by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if task exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if task belongs to user
   */
  belongsToUser(taskId: string, userId: string): Promise<boolean>;
}
