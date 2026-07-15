import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoProyecto } from '../../enum/estado-proyecto.enum';

export class CreateProyectoDto {
  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'App E-commerce',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    description: 'ID del cliente (opcional)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  idCliente?: number | null;

  @ApiProperty({
    description: 'Estado inicial',
    enum: EstadoProyecto,
    required: false,
  })
  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;
}
