import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min, ValidateNested } from 'class-validator';

class PatientNameDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'])
    use: string;

    @IsNotEmpty() family: string;
    @IsNotEmpty() given: string[];
}

class PatientAddressDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(['home', 'work', 'temp', 'old', 'billing'])
    use: string;

    @IsNotEmpty() line: string[];
    @IsNotEmpty() state: string;
    @IsNotEmpty() city: string;
}

const genders = Object.values(Gender);

export class CreatePatientDto {
    @IsNotEmpty() @IsString() @IsIn(['Patient']) resourceType: string;
    @IsNotEmpty() @IsBoolean() active: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => PatientNameDto)
    name: PatientNameDto[];

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(genders)  gender: string;
    
    @IsNotEmpty() @IsDateString() birthDate: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => PatientAddressDto)
    address: PatientAddressDto[];
}