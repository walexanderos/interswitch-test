import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { Task, TaskStatus } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { CodeService } from '../code/code.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly codeService: CodeService,
  ) {}

  async getTaskById(id: number): Promise<Task | null> {
    return await this.prismaservice.task.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getTaskByCode(task_code: string): Promise<Task | null> {
    return await this.prismaservice.task.findUnique({
      where: {
        code: task_code,
      },
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.prismaservice.task.findMany();
  }

  async deleteTask(id: number): Promise<Task> {
    return await this.prismaservice.task.delete({
      where: {
        id: id,
      },
    });
  }

  // validate hierarchy level based on code pattern
  private validateHeirachy(code: string): number {
    return code.split('-').length;
  }

  private async generateParentCode(): Promise<string> {
    let uniquecode = await this.codeService.generateCode('AAA-NNN');
    return 'ITS-' + uniquecode;
  }

  // Generate a new child code based on parent code
  private generateChildCode(code: string): string {
    let last_part = code.split('-').pop();
    const append_part = (parseInt(last_part, 10) + 1)
      .toString()
      .padStart(3, '0');
    return `${last_part}-${append_part}`;
  }

  private async determineParentNCode(body: CreateTaskDto) {
    let code: string;
    let parent_id: number = null;
    if (body.parent_task_code) {
      let existing_parent_task = await this.getTaskByCode(
        body.parent_task_code,
      );
      if (!existing_parent_task) {
        throw new BadRequestException(
          "Selected parent task '" + body.parent_task_code + "' does not exist",
        );
      }

      const hierarchyLevel = this.validateHeirachy(body.parent_task_code);
      if (hierarchyLevel >= 6) {
        throw new BadRequestException('Children task cannot be more than 5.');
      }

      parent_id = Number(existing_parent_task.id);
      code = this.generateChildCode(body.parent_task_code);
    } else {
      code = await this.generateParentCode();
    }

    return { code, parent_id };
  }

  async createTask(body: CreateTaskDto, user_id: number): Promise<Task> {
    const { code, parent_id } = await this.determineParentNCode(body);

    return await this.prismaservice.task.create({
      data: {
        code: code,
        title: body.title,
        description: body.description,
        creator_id: user_id,
        ...(body.status
          ? {
              status:
                TaskStatus[
                  body.status.toUpperCase() as keyof typeof TaskStatus
                ],
            }
          : {}),
        ...(body.assigned_date ? { assigned_date: new Date(body.assigned_date) } : {}),
        ...(body.due_date ? { due_date: new Date(body.due_date) } : {}),
        ...(body.assignee_id ? { assignee_id: body.assignee_id } : {}),
        ...(parent_id ? { parent_task: parent_id } : {}),
      },
    });
  }

  async updateTask(id: number, body: UpdateTaskDto): Promise<Task> {
    const { code, parent_id } = await this.determineParentNCode(body);

    return await this.prismaservice.task.update({
      where: {
        id: id,
      },
      data: {
        code: code,
        title: body.title,
        description: body.description,
        ...(body.status
          ? {
              status:
                TaskStatus[
                  body.status.toUpperCase() as keyof typeof TaskStatus
                ],
            }
          : {}),
        ...(body.assigned_date ? { assigned_date: new Date(body.assigned_date) } : {}),
        ...(body.due_date ? { due_date: new Date(body.due_date) } : {}),
        ...(body.assignee_id ? { assignee_id: body.assignee_id } : {}),
        ...(parent_id ? { parent_task: parent_id } : {}),
      },
    });
  }
}
