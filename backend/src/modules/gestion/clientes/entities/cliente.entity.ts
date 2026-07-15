import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { EstadoCliente } from '../enum/estado-cliente-enum';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true, nullable: false })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: EstadoCliente,
    enumName: 'estados_clientes',
    default: EstadoCliente.ACTIVO,
  })
  estado!: EstadoCliente;

  // Funcionalidad extra
  @Column({ type: 'text', nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  correo?: string;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
