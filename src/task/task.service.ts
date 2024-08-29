import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { Task, TaskStatus } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { CodeService } from '../code/code.service';

@Injectable()
export class TaskService {
    constructor(
        private readonly prismaservice: PrismaService,
        private readonly codeService: CodeService
    ){}

    async getTaskById(id: number): Promise<Task | null>{
        return await this.prismaservice.task.findUnique({
            where: {
                id:id
            }
        });
    }

    async getTaskByCode(task_code: string): Promise<Task | null>{
        return await this.prismaservice.task.findUnique({
            where: {
                code:task_code
            }
        });
    }

    async getAllTasks(): Promise<Task[]>{
        return await this.prismaservice.task.findMany();
    }

    async deleteTask(id: number): Promise<Task>{
        return await this.prismaservice.task.delete({
            where: {
                id:id
            }
        });
    }

    async createTask(user_id: number, body: CreateTaskDto): Promise<Task>{
        return await this.prismaservice.task.create({
            data: {
                code: "ee",
                title: body.title,
                description: body.description,
                creator_id: user_id,
                ...(body.status ? { status: TaskStatus[body.status.toUpperCase() as keyof typeof TaskStatus]} : {}),
                ...(body.assigned_date ? {assigned_date: body.assigned_date} : {}),
                ...(body.due_date ? {due_date: body.due_date} : {}),
                ...(body.assignee_id ? {assignee_id: body.assignee_id} : {})
            }
        });
    }

    async updateTask(id: number, body: UpdateTaskDto): Promise<Task>{
        return await this.prismaservice.task.update({
            where:{
                id: id
            },
            data: {
                code: "ee",
                title: body.title,
                description: body.description,
                ...(body.status ? { status: TaskStatus[body.status.toUpperCase() as keyof typeof TaskStatus]} : {}),
                ...(body.assigned_date ? {assigned_date: body.assigned_date} : {}),
                ...(body.due_date ? {due_date: body.due_date} : {}),
                ...(body.assignee_id ? {assignee_id: body.assignee_id} : {}),
            }
        });
    }
}
