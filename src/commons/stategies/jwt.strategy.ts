import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/app/app.service';

export interface AccessTokenPayload {
    sub: string;
    type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
  constructor(
    private readonly appconfig: AppConfigService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appconfig.auth.jwt_secret,
      signOptions: {
        expiresIn: '1d',
      },
    });
  }

  async validate (payload: AccessTokenPayload): Promise<any> {
    const { sub: id } = payload;

    return true;
  }
}
