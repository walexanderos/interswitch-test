import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePatientDto } from '../dto/patient.dto';

@Controller('patients')
@ApiTags('FHIR')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Create Patient' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createPatient(@Body() body: CreatePatientDto) {
    return await this.patientService.createPatient(body);
  }

  @ApiOperation({ summary: 'List Patients' })
  @Get()
  public async getAllPatient() {
    return await this.patientService.getAllPatients();
  }
}
