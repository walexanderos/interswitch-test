import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { CodeModule } from '../code/code.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [CodeModule]
})
export class TaskModule {}
