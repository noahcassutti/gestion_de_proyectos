import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Usuario',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  clave!: string;
}
