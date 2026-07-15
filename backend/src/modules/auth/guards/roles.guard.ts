import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { RolUsuario } from '../../gestion/usuarios/enum/rol-usuario.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; 
    }
    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.some((role) => user.rol?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos suficientes',
      );
    }

    return true;
  }
}
