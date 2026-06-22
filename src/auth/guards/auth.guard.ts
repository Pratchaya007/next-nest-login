import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authTokenService: AuthTokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. เขียนเช็ค Decorators
    const isPublic = this.reflector.getAllAndOverride<Request>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. ดึงค่ามาจอง req
    const request = context.switchToHttp().getRequest<Request>();
    // 3. มี Token แนบมากับ Header ไหม “ไปหา JWT จาก Authorization Header ที่อยู่ในรูปแบบ Bearer Token”
    const token = this.extractJwtFromHeader(request);
    if (!token)
      throw new BadRequestException({
        message: 'Authorization is request, expected: Bearer authorization',
        code: 'INVALID_AUTHORIZATION',
      });
    //4. ตรวจสอบและมีการแสดง Error เกี่ยวกับ Token
    try {
      const payload = await this.authTokenService.verify(token);
      request.user = payload;
      // console.log('Testttttttttttt', payload);
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException({
          message: 'Invalid Token',
          code: 'INVALID_TOKEN',
        });
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException({
          message: 'Token has Expired',
          code: 'TOKEN_EXPIRED',
        });
    }

    return true;
  }

  private extractJwtFromHeader(request: Request): string | undefined {
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];
    return bearer !== 'Bearer' || !token ? undefined : token;
  }
}
