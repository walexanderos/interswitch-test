import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { AppConfigService } from '../config/app/app.service';
import { RefreshToken, Role, User } from '@prisma/client';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { appConstant } from '../commons/constants/app.constant';
import { RegisterDto } from '../dto/auth.dto';
import { hash } from 'bcrypt';

  export interface RefreshTokenPayload {
    jti: number;
    sub: string;
    type: string;
  }
  
  @Injectable()
  export class AuthService {
    private BASE_OPTIONS: SignOptions;
    public constructor (
      private readonly jwt: JwtService,
      private readonly prismaService: PrismaService,
      private readonly appconfig: AppConfigService
      ) {
        this.BASE_OPTIONS = {
            issuer: appconfig.url
          }
      }
  
    public async generateAccessToken (user_id: number): Promise<string> {
      const opts: JwtSignOptions = {
        ...this.BASE_OPTIONS,
        subject: String(user_id),
      }
  
      return this.jwt.signAsync({}, opts)
    }
  
    public async generateConfirmationToken(user_id: number, username: string): Promise<string> {
      const opts: SignOptions = {
          ...this.BASE_OPTIONS,
          expiresIn: '1d',
          subject: username,
          jwtid: String(user_id),
      }
      return this.jwt.signAsync({}, opts)
    }
  
    public async resolveConfirmationToken (encoded: string): Promise<User> {
      const payload = await this.decodeRefreshToken(encoded)
  
      const user = await this.getUserFromRefreshTokenPayloadNUsername(payload)
  
      if (!user) {
        throw new UnprocessableEntityException('Token malformed')
      }
  
      return user;
    }
  
    private async getUserFromRefreshTokenPayloadNUsername (payload: RefreshTokenPayload): Promise<User> {
      const subId = payload.sub
  
      if (!subId) {
        throw new UnprocessableEntityException('Refresh token malformed')
      }
  
      return await this.getUserByUsername(subId)
    }

    public async getUserById(id: number): Promise<User | null> {
      return await this.prismaService.user.findUnique({
        where: {
          id: id
        },
        include:{
          role: {
            include: {
              roles_permission: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });
    }

    public async getUserByUsername(username: string): Promise<User | null> {
      return await this.prismaService.user.findUnique({
        where: {
          username: username
        },
        include:{
          role: {
            include: {
              roles_permission: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });
    }

    public async getRoleById(id: number): Promise<Role | null> {
      return await this.prismaService.role.findUnique({
        where: {
          id: id
        }
      });
    }

    public async getRoles(): Promise<Role[]> {
      return await this.prismaService.role.findMany({
        include: {
          roles_permission: {
            include: {
              permission: true
            }
          }
        }
      });
    }

    public async createUser(request: RegisterDto): Promise<User> {
      return await this.prismaService.user.create({
        data: {
          username: request.username,
          role_id: request.role_id,
          password: await hash(request.password, 10)
        }
      });
    }

    public async createRefreshToken(user_id: number, ttl: number): Promise<RefreshToken>{
        const expiration = new Date();
            expiration.setTime(expiration.getTime() + ttl)

        const token = await this.prismaService.refreshToken.create({
            data: {
             user_id,
             expiry_date: expiration
            }
         });
 
         if (!token) {
             throw new InternalServerErrorException("Unable to create token. Please try again")
         }
 
         return token;
    }

    public async getTokenByUserId(user_id: number) : Promise<RefreshToken | null>{
        return await this.prismaService.refreshToken.findFirst({
            where:{
                user_id
            }
         });
    }

    public async generateRefreshToken (user_id: number, expiresIn: number): Promise<string> {
      const token = await this.createRefreshToken(user_id, expiresIn)
  
      const opts: SignOptions = {
        ...this.BASE_OPTIONS,
        expiresIn,
        subject: String(user_id),
        jwtid: String(token.user_id),
      }
  
      return await this.jwt.signAsync({}, opts)
    }
  
    public async resolveRefreshToken (encoded: string): Promise<{ user: User, token: RefreshToken }> {
      const payload = await this.decodeRefreshToken(encoded)
      const token = await this.getStoredTokenFromRefreshTokenPayload(payload)
  
      if (!token) {
        throw new UnprocessableEntityException('Refresh token not found')
      }
  
      if (token.is_revoked) {
        throw new UnprocessableEntityException('Refresh token revoked')
      }
  
      const user = await this.getUserFromRefreshTokenPayload(payload)
  
      if (!user) {
        throw new UnprocessableEntityException('Refresh token malformed')
      }
  
      return { user, token}
    }
  
    public async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: User}> {
      const { user } = await this.resolveRefreshToken(refresh)
  
      const token = await this.generateAccessToken(user.id)
  
      return { user, token }
    }
    
    private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
      try {
        return await this.jwt.verifyAsync(token)
      } catch (e) {
        if (e instanceof TokenExpiredError) {
          throw new UnprocessableEntityException('Token expired')
        } else {
          throw new UnprocessableEntityException('Token malformed') 
        }
      }
    }
  
    private async getUserFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<User> {
      const subId = payload.sub
  
      if (!subId) {
        throw new UnprocessableEntityException('Refresh token malformed')
      }

      return await this.getUserById(Number(subId));
    }
  
    private async getStoredTokenFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<RefreshToken | null> {
      const tokenId = payload.jti
  
      if (!tokenId) {
        throw new UnprocessableEntityException('Refresh token malformed')
      }
  
      return this.getTokenByUserId(tokenId)
    }
  }
