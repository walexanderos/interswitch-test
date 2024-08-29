import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { Code } from '@prisma/client';

@Injectable()
export class CodeService {
    private letters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private digits: string = "0123456789";
    private limit: number = 12;
    private default_pattern: string = "AAA-NNN-SSSS";
    private pattern: string = "AAA-NNN-SSSS";
    constructor(private readonly prismaservice: PrismaService){}

    async generateCode(){
        let code: string;
        let is_existing: Code | null; 
        do {
            code = this.createCode();
            is_existing = await this.getCode(code);
        }while(is_existing);

        // code is valid
        await this.saveCode(code);
        return code;
    }

    private createCode(): string{
        let part = this.pattern.split('-');

        if(part.length < 1) {
            part = this.default_pattern.split('-');
        }

        let code: string[] = [];
        for (let index = 0; index < part.length; index++) {
            let code_part = Array.from({length: part[index].length}, () => {
                if(index == 0){
                    return this.letters.charAt(Math.floor(Math.random() * this.letters.length));
                }else if(index == 1){
                    return this.digits.charAt(Math.floor(Math.random() * this.digits.length));
                }else{
                    if(Math.random() < 0.5){
                        return this.letters.charAt(Math.floor(Math.random() * this.letters.length)).toLowerCase();
                    }else{
                        return this.digits.charAt(Math.floor(Math.random() * this.digits.length));
                    }
                }
            }).join('');

            code.push(code_part);

        }

        return code.join("-");
    }

    async saveCode(code: string): Promise<Code>{
        return await this.prismaservice.code.create({
            data:{
                code: code
            }
        });
    }

    async getCode(code: string): Promise<Code | null>{
        return await this.prismaservice.code.findUnique({
            where: {
                code:code
            }
        });
    }

    async getAllCodes(){
        return await this.prismaservice.code.findMany();
    }

    validateFormat(code: string): boolean {
        const pattern = "/^[A-Z]{3}-[0-9]{3}-[a-z0-9]{4}$/";
        return pattern.match(code) ? true : false;
    }

    async setCodePattern(pattern: string) {

    }
}
