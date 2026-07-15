import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoCliente } from '../enum/estado-cliente-enum';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nombre único del cliente',
    example: 'Empresa S.A.',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    description: 'Estado actual del cliente',
    enum: EstadoCliente,
    example: EstadoCliente.ACTIVO,
  })
  @IsEnum(EstadoCliente, { message: 'El estado debe ser ACTIVO o BAJA' })
  @IsNotEmpty()
  estado!: EstadoCliente;

  // CONTACTO FUNCIONALIDAD EXTRA
  @ApiProperty({
    description: 'Teléfono de contacto del cliente',
    required: false,
    example: '+54 9 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    required: false,
    example: 'contacto@empresa.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  correo?: string;
}
