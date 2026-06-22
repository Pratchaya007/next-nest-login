import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES } from '../decorators/role.decorator';
import { Role } from 'src/database/generated/prisma/enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //1. เช็ค Decorator in Header
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;

    // 2. ไปรับค่า req
    const request = context.switchToHttp().getRequest<Request>();
    // 3. ดึงค่า role in Token มาใช้งาน
    const userRole = request.user?.role;

    // 4. throw new Error
    if (!userRole) throw new Error('Role connot use without Authorization');

    // 5. find roles Includes in UserRole
    if (!roles.includes(userRole))
      throw new ForbiddenException(
        'Insufficient Permission to perform this action',
      );

    return true;
  }
}
