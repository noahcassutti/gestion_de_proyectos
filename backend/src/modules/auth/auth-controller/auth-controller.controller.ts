import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from '../dtos/input/login.dtos';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthControllerController {
  constructor(private readonly authService: AuthServiceService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticación exitosa. Devuelve el token de acceso JWT.',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Estructura del Body inválida.',
  })
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }
}
