import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TareasService } from '../tareaservice/tareaservice.service';
import { CreateTareaDto } from '../dtos/input/create-tarea-dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea-dto';
import { AuthGuardGuard } from '../../../auth/guards/auth-guard.guard';
import { RolUsuario } from '../../usuarios/enum/rol-usuario.enum';
import { ROLES } from '../../../auth/decorators/roles.decorators';
import { RolesGuard } from '../../../auth/guards/roles.guard';

@ApiTags('Tareas')
@Controller('tareas')
export class TareacontrollerController {
  constructor(private readonly tareasService: TareasService) {}

  @Get('calendario')
  async obtenerEventos() {
    return await this.tareasService.obtenerTareasParaCalendario();
  }

  // Crear tarea
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea asignandolo a un proyecto' })
  @ApiParam({
    name: 'idProyecto',
    description: 'ID del proyecto',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tarea creada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async createTarea(@Body() dto: CreateTareaDto): Promise<{ id: number }> {
    return await this.tareasService.crearTarea(dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get('proyecto/:idProyecto')
  @ApiOperation({
    summary: 'Ver las tareas que componen un proyecto',
  })
  async obtenerTareas(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    return await this.tareasService.obtenerTareasPorProyecto(idProyecto);
  }

  // Actualizar
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea a modificar',
    example: 5,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tarea actualizada correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró la tarea con eL ID.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTareaDto,
  ): Promise<void> {
    return await this.tareasService.actualizarTarea(dto, id);
  }

  // Eliminar
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard, RolesGuard)
  @ROLES(RolUsuario.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tarea a eliminar',
    example: 5,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tarea eliminada correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontró la tarea.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async eliminarTarea(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tareasService.eliminarTarea(id);
  }
}
