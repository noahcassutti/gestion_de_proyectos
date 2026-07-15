import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoProyecto } from '../enum/estado-proyecto.enum';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Tarea } from '../../tareas/entities/tarea-entity';

@Entity({ name: 'proyectos' })
export class Proyecto {
  @ApiProperty({ description: 'ID único del proyecto', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @ApiProperty({
    description: 'Nombre único del proyecto',
    example: 'Migración a AWS',
  })
  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @ApiProperty({
    description: 'Estado actual del proyecto',
    enum: EstadoProyecto,
    example: EstadoProyecto.ACTIVO,
  })
  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    enumName: 'estados_proyectos',
    default: EstadoProyecto.ACTIVO,
  })
  estado!: EstadoProyecto;

  @ApiProperty({
    description: 'ID del cliente al que pertenece (opcional)',
    example: 1,
    nullable: true,
  })
  @Column({ name: 'id_cliente', type: 'int', nullable: true })
  idCliente?: number | null;

  // Muchos proyectos pertenecen a un cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente | null;

  // un proyecto tiene muchas tareas
  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas!: Tarea[];
}
