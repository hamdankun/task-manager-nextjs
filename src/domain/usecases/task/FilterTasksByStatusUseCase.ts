import { Task, TaskStatus } from "../../entities/Task";
import { ITaskRepository } from "../../repositories/ITaskRepository";
import { ValidationError } from "../../errors";

/**
 * Filter Tasks By Status Use Case
 * Business logic for filtering tasks by status
 * Independent of framework and database
 */
export class FilterTasksByStatusUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: FilterTasksInput): Promise<Task[]> {
    // Validate input
    this.validateInput(input);

    return await this.taskRepository.findByUserIdAndStatus(
      input.userId,
      input.status as TaskStatus
    );
  }

  private validateInput(input: FilterTasksInput): void {
    if (!input.userId || input.userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }

    if (!input.status || input.status.trim().length === 0) {
      throw new ValidationError("Status is required");
    }

    if (!Object.values(TaskStatus).includes(input.status as TaskStatus)) {
      throw new ValidationError(
        "Invalid task status. Must be: to do, in progress, or done"
      );
    }
  }
}

export interface FilterTasksInput {
  userId: string;
  status: string;
}
