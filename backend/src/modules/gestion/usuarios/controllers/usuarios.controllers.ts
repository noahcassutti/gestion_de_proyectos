import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardGuard } from '../../../auth/guards/auth-guard.guard';
import { UsuarioServiceService } from '../usuario-service/usuario-service.service';

@ApiTags('Usuarios')
@ApiBearerAuth('token')
@UseGuards(AuthGuardGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuarioServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  async findAll() {
    return await this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usuariosService.findOne(id);
  }

  @Get('nombre/:nombre')
  @ApiOperation({ summary: 'Buscar un usuario por nombre' })
  async findByNombre(@Param('nombre') nombre: string) {
    return await this.usuariosService.findByNombre(nombre);
  }
}
