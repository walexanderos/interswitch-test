import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Controller('tasks')
@ApiTags("Tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create Task' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createTask(@Body() body: CreateTaskDto) {
    const task = await this.taskService.createTask(body, 1);
    return {
      ...task,
      id: Number(task.id),
      parent_task: task.parent_task ? Number(task.parent_task) : task.parent_task
    };
  }

  @ApiOperation({ summary: 'List all tasks' })
  @Get()
  public async getAllTask() {
    const tasks = await this.taskService.getAllTasks();

    return tasks.map((x) => {
      return {
        ...x,
        id: Number(x.id),
        parent_task: x.parent_task ? Number(x.parent_task) : x.parent_task
      }
    });
  }

  @ApiOperation({ summary: 'Fetch task by id' })
  @Get('/:id')
  public async getTaskById(@Param('id') id: number) {
    const task = await this.taskService.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      ...task,
      id: Number(task.id),
      parent_task: task.parent_task ? Number(task.parent_task) : task.parent_task
    };
  }

  @ApiOperation({ summary: 'Fetch task by code' })
  @Get('/code/:code')
  public async getTaskByCode(@Param('code') code: string) {
    const task = await this.taskService.getTaskByCode(code);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      ...task,
      id: Number(task.id),
      parent_task: task.parent_task ? Number(task.parent_task) : task.parent_task
    };
  }

  @ApiOperation({ summary: 'Update task' })
  @Put('/:id')
  public async updateTask(
    @Param('id') id: number,
    @Body() input: UpdateTaskDto,
  ) {
    const task = await this.taskService.updateTask(
      id,
      input,
    );
    return {
      ...task,
      id: Number(task.id),
      parent_task: task.parent_task ? Number(task.parent_task) : task.parent_task
    };;
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete('/:id')
  public async deleteTask(@Param('id') id: number) {
    const task = await this.taskService.deleteTask(id);
    return {
      ...task,
      id: Number(task.id),
      parent_task: task.parent_task ? Number(task.parent_task) : task.parent_task
    };
  }
}
