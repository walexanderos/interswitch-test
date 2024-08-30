import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { CreatePatientDto } from '../dto/patient.dto';
import { Gender, Patient } from '@prisma/client';

@Injectable()
export class PatientService {
    constructor(private readonly prismaservice: PrismaService){}

    async getAllPatients(){
        return await this.prismaservice.patient.findMany({
            include: {
                names: true,
                address: true,
                tasks: true
            }
        });
    }

    async createPatient(body: CreatePatientDto){

        return await this.prismaservice.patient.create({
            data: {
                active: body.active,
                gender: Gender[body.gender.toUpperCase() as keyof typeof Gender],
                birth_date: new Date(body.birthDate),
                names: {
                    createMany: {
                        data: body.name.map(name => {
                            return { ...name, given: name.given.join(', ')}
                        })
                    }
                },
                address: {
                    createMany: {
                        data: body.address.map(address => {
                            return { ...address, line: address.line.join('||')}
                        })
                    }
                }
            },
            include:{
                names: true,
                address: true,
                tasks: true
            }
        });
    }
}
