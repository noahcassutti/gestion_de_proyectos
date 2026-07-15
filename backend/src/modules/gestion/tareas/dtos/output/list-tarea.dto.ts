import { ApiProperty } from '@nestjs/swagger';
import { EstadoTarea } from '../../enum/estado-tareas-enum';

export class ListTareaDto {
  @ApiProperty({
    description: 'ID de la tarea',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Detalle de la tarea',
    example: 'Modelar las tablas de la base de datos en PostgreSQL',
  })
  descripcion!: string;

  @ApiProperty({
    description: 'Estado actual en el que se encuentra la tarea',
    enum: EstadoTarea,
    example: EstadoTarea.PENDIENTE,
  })
  estado!: EstadoTarea;

  @ApiProperty({ description: 'Fecha de inicio de la tarea', required: false })
  fecha_inicio?: Date;

  @ApiProperty({ description: 'Fecha límite de la tarea', required: false })
  fecha_limite?: Date;
}
