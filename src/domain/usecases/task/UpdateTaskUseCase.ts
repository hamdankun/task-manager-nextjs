import { Task, TaskStatus } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { ValidationError, NotFoundError } from "../../errors";

/**
 * Update Task Use Case
 * Business logic for updating a task
 * Independent of framework and database
 */
export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    // Validate input
    this.validateInput(input);

    // Check if task exists and belongs to user
    const taskBelongs = await this.taskRepository.belongsToUser(
      input.id,
      input.userId
    );

    if (!taskBelongs) {
      throw new NotFoundError("Task");
    }

    // Get existing task
    const existingTask = await this.taskRepository.findById(input.id);
    if (!existingTask) {
      throw new NotFoundError("Task");
    }

    // Create updated task
    const updatedTask = new Task(
      existingTask.id,
      input.title || existingTask.title,
      existingTask.userId,
      (input.status as TaskStatus) || existingTask.status,
      input.description !== undefined ? input.description : existingTask.description,
      existingTask.createdAt,
      new Date()
    );

    return await this.taskRepository.update(updatedTask);
  }

  private validateInput(input: UpdateTaskInput): void {
    if (!input.id || input.id.trim().length === 0) {
      throw new ValidationError("Task ID is required");
    }

    if (!input.userId || input.userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }

    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new ValidationError("Task title cannot be empty");
    }

    if (input.title && input.title.length > 255) {
      throw new ValidationError("Task title must be less than 255 characters");
    }

    if (input.description && input.description.length > 5000) {
      throw new ValidationError(
        "Task description must be less than 5000 characters"
      );
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
}

export interface UpdateTaskInput {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  status?: string;
}
