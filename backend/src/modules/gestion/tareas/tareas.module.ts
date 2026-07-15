import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TareacontrollerController } from './tareacontroller/tareacontroller.controller';
import { TareasService } from './tareaservice/tareaservice.service';
import { Tarea } from './entities/tarea-entity';
import { JwtModule } from '@nestjs/jwt';
import { Proyecto } from '../proyectos/entities/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Proyecto]), JwtModule],
  controllers: [TareacontrollerController],
  providers: [TareasService],
})
export class TareasModule {}
