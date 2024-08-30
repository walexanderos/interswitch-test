import { TaskStatus } from '@prisma/client';
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';

const validStatuses = Object.values(TaskStatus);

export class SetPatternDto {
    @IsNotEmpty() @IsString() @Length(12, 12) pattern: string;
}

export class CreateTaskDto {
    @IsNotEmpty() @IsString() title: string;
    @IsNotEmpty() @IsString() description: string;
    @IsOptional() @IsIn(validStatuses)  status: string;
    @IsOptional() @IsDateString() assigned_date?: Date;
    @IsOptional() @IsDateString() due_date?: Date;
    @IsOptional() @IsInt() @Min(1) assignee_id?: number;
    @IsOptional() @IsString() parent_task_code?: string;
}

export class UpdateTaskDto extends CreateTaskDto{}