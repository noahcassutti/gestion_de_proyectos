import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { EstadoTarea } from '../../enum/estado-tareas-enum';

export class CreateTareaDto {
  @ApiProperty({
    description: 'Descripción de la tarea a realizar',
    example: 'Modelar las tablas de la base de datos en PostgreSQL',
  })
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @ApiProperty({
    description: 'Estado actual de la tarea',
    enum: EstadoTarea,
    required: false,
  })
  @IsEnum(EstadoTarea)
  @IsOptional()
  estado?: EstadoTarea;

  @ApiProperty({
    description: 'ID del proyecto al que pertenece',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id_proyecto!: number;

  @IsOptional()
  @IsString()
  fecha_inicio?: string;

  @IsOptional()
  @IsString()
  fecha_limite?: string;
}
