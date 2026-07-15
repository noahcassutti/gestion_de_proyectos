import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from '../gestion/usuarios/usuarios.module';
import { TareasModule } from '../gestion/tareas/tareas.module';
import { AuthControllerController } from './auth-controller/auth-controller.controller';
import { AuthServiceService } from './auth-service/auth-service.service';
import { AuthGuardGuard } from './guards/auth-guard.guard';

@Module({
  imports: [
    UsuariosModule,
    TareasModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AuthControllerController],
  providers: [AuthServiceService, AuthGuardGuard],
  exports: [AuthGuardGuard, AuthServiceService],
})
export class AuthModule {}
