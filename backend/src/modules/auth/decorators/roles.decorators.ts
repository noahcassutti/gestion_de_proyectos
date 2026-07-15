import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../gestion/usuarios/enum/rol-usuario.enum';

export const ROLES_KEY = 'roles';
export const ROLES = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
