import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. መጀመሪያ ለዚህ መንገድ (Route) ምን አይነት Role እንደሚያስፈልግ አንብብ
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ምንም አይነት Role ካልተጠየቀ፣ ማንኛውም ሰው ማለፍ ይችላል
    if (!requiredRoles) {
      return true;
    }

    // 2. ጥያቄውን የላከውን ተጠቃሚ Role አውጣ (ከ JWT Token የመጣ)
    const { user } = context.switchToHttp().getRequest();

    // 3. የተጠቃሚው Role ከተፈቀደው Role ጋር ይገጥማል?
    const userRole: Role | undefined = user?.role;
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  }
}
