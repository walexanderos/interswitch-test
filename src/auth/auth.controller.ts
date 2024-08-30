import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../commons/guards/jwtauth.guard';
import { appConstant, PERMISSIONS } from '../commons/constants/app.constant';
import { compare } from 'bcrypt';
import { PermissionsGuard } from '../commons/guards/permissions.guard';
import { Permissions } from '../commons/decorators/permissions.decorator';

export interface AuthenticationPayload {
  user: User;
  payload: {
    type: string;
    token: string;
    refresh_token?: string;
  };
}

@ApiTags('Identity')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @Post('/register')
  @Permissions(PERMISSIONS.USER.CREATE.name)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  public async register(@Body() request: RegisterDto) {
    let role = await this.authService.getRoleById(request.role_id);

    if (!role) {
      throw new BadRequestException('Selected role not found');
    }

    let user = await this.authService.getUserByUsername(request.username);

    if (user) {
      throw new BadRequestException('User already exist');
    }

    await this.authService.createUser(request);

    return "User created successfully";
  }

  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  public async login(@Body() request: LoginDto) {
    let user = await this.authService.getUserByUsername(request.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!compare(request.password, user.password)) {
      throw new UnauthorizedException('credentials');
    }

    return await this.processLogin(user);
  }

  private async processLogin(user: User) {

    const token = await this.authService.generateAccessToken(user.id);
    const refresh = await this.authService.generateRefreshToken(user.id, 60 * 60 * 24 * 30);

    return this.buildResponsePayload(user, token, refresh);
  }

  @ApiOperation({ summary: 'Fetch data on current logged in user' })
  @Get('/currentUser')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Req() request) {
    return request.user;
  }

  @ApiOperation({ summary: 'Get roles with their corressponding permission' })
  @Get('/roles')
  public async getRoles() {
    return await this.authService.getRoles();
  }


  private buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
