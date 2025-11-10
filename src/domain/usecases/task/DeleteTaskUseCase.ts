import { ITaskRepository } from "../../repositories/ITaskRepository";
import { ValidationError, NotFoundError } from "../../errors";

/**
 * Delete Task Use Case
 * Business logic for deleting a task
 * Independent of framework and database
 */
export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<boolean> {
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

    return await this.taskRepository.delete(input.id);
  }

  private validateInput(input: DeleteTaskInput): void {
    if (!input.id || input.id.trim().length === 0) {
      throw new ValidationError("Task ID is required");
    }

    if (!input.userId || input.userId.trim().length === 0) {
      throw new ValidationError("User ID is required");
    }
  }
}

export interface DeleteTaskInput {
  id: string;
  userId: string;
}
