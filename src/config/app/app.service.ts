import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */

type smtp = {
  host: string;
  user: string;
  password: string;
  from: string;
  port: number;
}

type auth = {
  jwt_secret: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get name(): string {
    return this.configService.get<string>('app.name');
  }

  get env(): string {
    return this.configService.get<string>('app.env');
  }

  get url(): string {
    return this.configService.get<string>('app.url');
  }

  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  get smtp(): smtp {
    return this.configService.get<smtp>('app.mail');
  }

  get auth(): auth {
    return this.configService.get<auth>('app.auth');
  }
}

