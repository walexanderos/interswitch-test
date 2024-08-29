import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';

@Module({
  controllers: [CodeController],
  providers: [CodeService],
  exports: [CodeService]
})
export class CodeModule {}
