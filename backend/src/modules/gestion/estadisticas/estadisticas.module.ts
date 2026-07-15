import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';

import { Cliente } from '../clientes/entities/cliente.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { Tarea } from '../tareas/entities/tarea-entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Proyecto, Tarea]), JwtModule],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
