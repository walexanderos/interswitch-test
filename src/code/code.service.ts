import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { Code } from '@prisma/client';

@Injectable()
export class CodeService {
  private letters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private digits: string = '0123456789';
  private limit: number = 12;
  private default_pattern: string = 'AAA-NNN-SSSS';
  private pattern: string = 'AAA-NNN-SSSS';
  constructor(private readonly prismaservice: PrismaService) {}

  async generateCode(custom_pattern: string = null): Promise<string>{
    let code: string;
    let is_existing: Code | null;

    // generate code an ensure that it does not already exist
    // if code exists, then generate another code
    do {
      code = this.createCode(custom_pattern);
      is_existing = await this.getCode(code);
    } while (is_existing !== null);

    // save unique code
    await this.saveCode(code);

    return code;
  }

  private createCode(custom_pattern: string = null): string {
    let part = custom_pattern ? custom_pattern.split('-'): this.pattern.split('-');

    if (part.length < 1) {
      part = this.default_pattern.split('-');
    }

    let code: string[] = [];


    for (let index = 0; index < part.length; index++) {
        // dynamically set char lenght based on pattern
      let code_part = Array.from({ length: part[index].length }, () => {

        // check for code  part type then generate character based on type
        if (part[index].at(0) == 'A') {
          return this.letters.charAt(
            Math.floor(Math.random() * this.letters.length),
          );
        } else if (part[index].at(0) == 'N') {
          return this.digits.charAt(
            Math.floor(Math.random() * this.digits.length),
          );
        } else {
          if (Math.random() < 0.5) {
            return this.letters
              .charAt(Math.floor(Math.random() * this.letters.length))
              .toLowerCase();
          } else {
            return this.digits.charAt(
              Math.floor(Math.random() * this.digits.length),
            );
          }
        }
      }).join('');

      code.push(code_part);
    }

    return code.join('-');
  }

  async saveCode(code: string): Promise<Code> {
    return await this.prismaservice.code.create({
      data: {
        code: code,
      },
    });
  }

  async getCode(code: string): Promise<Code | null> {
    return await this.prismaservice.code.findUnique({
      where: {
        code: code,
      },
    });
  }

  async getAllCodes() {
    return await this.prismaservice.code.findMany();
  }

  validateFormat(code: string): {pattern: string, match: boolean} {
    const regexPattern = this.defineRegexPattern(this.pattern);
    return {
        pattern: this.pattern,
        match: regexPattern.test(code)
    };
  }

  private defineRegexPattern(pattern: string): RegExp {
    const parts = pattern.split('-');
    let regexString = '^';
    let regexStringPart: string[] = [];

    for (const part of parts) {
      switch (part.at(0)) {
        case 'A':
          regexStringPart.push('[A-Z]{' + part.length + '}');
          break;
        case 'N':
          regexStringPart.push('\\d{' + part.length + '}');
          break;
        default:
          regexStringPart.push('[a-z0-9]{' + part.length + '}');
      }
    }

    regexString += regexStringPart.join('-');
    regexString += '$';

    return new RegExp(regexString);
  }

  setCodePattern(pattern: string): boolean {
    if (pattern && pattern.length == this.limit) {
      this.pattern = pattern.toUpperCase();
      return true;
    }
    return false;
  }
}
