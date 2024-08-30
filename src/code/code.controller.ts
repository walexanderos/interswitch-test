import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CodeService } from './code.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SetPatternDto } from '../dto/task.dto';

@Controller('codes')
@ApiTags("Code")
export class CodeController {
  constructor(private readonly codeService: CodeService) {}
  
  @ApiOperation({ summary: 'Generate code' })
  @Post('/generate')

  async createCode() {
    return this.codeService.generateCode();
  }

  @ApiOperation({ summary: 'get all codes' })
  @Get('/')
  async getAllCode() {
    // we can implement pagination here
    return this.codeService.getAllCodes();
  }

  @ApiOperation({ summary: 'validate code pattern' })
  @ApiQuery({
    name: 'code',
    description: 'Validate code format',
    required: true,
  })
  @Get('/validate')
  async validCodeFormat(@Query() query: any) {
    // we can implement pagination here
    return this.codeService.validateFormat(query.code);
  }

  @ApiOperation({ summary: 'Set Code Pattern' })
  @Post('/set-pattern')
  async setCodePattern(@Body() body: SetPatternDto) {
    return this.codeService.setCodePattern(body.pattern);
  }
}
