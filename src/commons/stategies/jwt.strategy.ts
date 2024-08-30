import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/app/app.service';
import { AuthService } from '../../auth/auth.service';

export interface AccessTokenPayload {
    sub: string;
    type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
  constructor(
    private readonly appconfig: AppConfigService,
    private readonly authService: AuthService
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
    return await this.authService.getUserById(Number(id));
  }
}
