import {
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EstadoTarea } from '../enum/estado-tareas-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity({ name: 'tareas' })
export class Tarea {
  @ApiProperty({
    description: 'ID de la tarea',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ApiProperty({
    description: 'Descripción de la tarea a realizar',
    example: 'Modelar las tablas de la base de datos en PostgreSQL',
    maxLength: 255,
  })
  @Column({ type: 'text', nullable: false })
  descripcion!: string;

  @ApiProperty({
    description: 'Estado actual de la tarea',
    enum: EstadoTarea,
    example: EstadoTarea.PENDIENTE,
  })
  @Column({
    name: 'estado',
    enum: EstadoTarea,
    enumName: 'estados_tareas',
    default: EstadoTarea.PENDIENTE,
  })
  estado!: EstadoTarea;

  @ApiProperty({
    description: 'ID del proyecto asociado',
    example: 1,
  })
  @Column({ name: 'id_proyecto', type: 'int' })
  id_proyecto!: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto!: Proyecto;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2026-06-15',
    nullable: true,
  })
  @Column({ name: 'fecha_inicio', type: 'timestamp', nullable: true })
  fecha_inicio?: Date;

  @ApiProperty({
    description: 'Fecha límite',
    example: '2026-06-20',
    nullable: true,
  })
  @Column({ name: 'fecha_limite', type: 'timestamp', nullable: true })
  fecha_limite?: Date;
}
