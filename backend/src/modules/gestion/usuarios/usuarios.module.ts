import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioServiceService } from './usuario-service/usuario-service.service';
import { Usuario } from './entities/input/usuario-entities';
import { UsuariosController } from './controllers/usuarios.controllers';
import { AuthGuardGuard } from '../../auth/guards/auth-guard.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuarioServiceService, AuthGuardGuard],
  exports: [UsuarioServiceService, TypeOrmModule],
})
export class UsuariosModule {}
