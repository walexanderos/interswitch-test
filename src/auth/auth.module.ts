import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../config/app/app.service';
import { JwtStrategy } from '../commons/stategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (appconfig: AppConfigService) => ({
        secret: appconfig.auth.jwt_secret,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [
        AppConfigService
        ],
    })
  ]
})
export class AuthModule {}