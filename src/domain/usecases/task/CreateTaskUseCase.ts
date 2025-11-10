import { Task, TaskStatus } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { ValidationError } from "../../errors";

/**
 * Create Task Use Case
 * Business logic for creating a new task
 * Independent of framework and database
 */
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: CreateTaskInput): Promise<Task> {
    // Validate input
    this.validateInput(input);

    // Create new task
    const task = new Task(
      this.generateId(),
      input.title,
      input.userId,
      (input.status as TaskStatus) || TaskStatus.TODO,
      input.description
    );

    return await this.taskRepository.create(task);
  }

  private validateInput(input: CreateTaskInput): void {
    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError("Task title is required");
    }

    if (input.title.length > 255) {
      throw new ValidationError("Task title must be less than 255 characters");
    }

    if (input.description && input.description.length > 5000) {
      throw new ValidationError(
        "Task description must be less than 5000 characters"
      );
    }

    if (!input.userId || input.userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }

    if (
      input.status &&
      !Object.values(TaskStatus).includes(input.status as TaskStatus)
    ) {
      throw new ValidationError(
        "Invalid task status. Must be: to do, in progress, or done"
      );
    }
  }

  private generateId(): string {
    // This will be replaced by repository/database
    return `task_${Date.now()}`;
  }
}

export interface CreateTaskInput {
  title: string;
  userId: string;
  description?: string;
  status?: string;
}
