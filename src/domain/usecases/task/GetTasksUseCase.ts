import { Task, TaskStatus } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { ValidationError } from "../../errors";

/**
 * Get Tasks Use Case
 * Business logic for retrieving tasks
 * Independent of framework and database
 */
export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: GetTasksInput): Promise<Task[]> {
    // Validate input
    this.validateInput(input);

    // Get tasks - with optional filtering
    if (input.status) {
      return await this.taskRepository.findByUserIdAndStatus(
        input.userId,
        input.status as TaskStatus
      );
    }

    return await this.taskRepository.findByUserId(input.userId);
  }

  private validateInput(input: GetTasksInput): void {
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
}

export interface GetTasksInput {
  userId: string;
  status?: string;
}
