import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './config/database/prisma/prisma.module';
import { HttpConfigModule } from './config/http/http.module';
import { CodeModule } from './code/code.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HttpConfigModule,
    CodeModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
