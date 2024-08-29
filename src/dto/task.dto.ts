import { TaskStatus } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

const validStatuses = Object.values(TaskStatus);

export class CreateTaskDto {
    @IsNotEmpty() @IsString() title: string;
    @IsNotEmpty() @IsString() description: string;
    @IsOptional() @IsIn(validStatuses)  status: string;
    @IsOptional() @IsDateString() assigned_date: Date;
    @IsOptional() @IsDateString() due_date: Date;
    @IsNotEmpty() @IsInt() @Min(1) assignee_id: number;
}

export class UpdateTaskDto extends CreateTaskDto{}