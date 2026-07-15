import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectosService } from './services/proyectos.service';
import { ProyectosController } from './controllers/proyectos.controller';
import { JwtModule } from '@nestjs/jwt'; // <-- 1. Importa esto
import { Cliente } from '../clientes/entities/cliente.entity';
import { ProyectosExportService } from './services/proyectos-export.service';
import { Tarea } from '../tareas/entities/tarea-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Cliente, Tarea]), JwtModule],

  controllers: [ProyectosController],
  providers: [ProyectosService, ProyectosExportService],
  exports: [ProyectosService],
})
export class ProyectosModule {}
