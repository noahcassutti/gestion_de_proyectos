import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProyectosService } from '../services/proyectos.service';
import { CreateProyectoDto } from '../dtos/input/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/input/update-proyecto.dto';
import { AuthGuardGuard } from '../../../auth/guards/auth-guard.guard';
import { Proyecto } from '../entities/proyecto.entity';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ROLES } from '../../../auth/decorators/roles.decorators';
import { RolUsuario } from '../../usuarios/enum/rol-usuario.enum';
import { QueryProyectoDto } from '../dtos/input/query-proyecto.dto';

@ApiTags('Proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  // Crear proyecto
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Proyecto creado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o el nombre ya existe.',
  })
  async createProyecto(
    @Body() dto: CreateProyectoDto,
  ): Promise<{ id: number }> {
    return await this.proyectosService.crearProyecto(dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get()
  @ApiOperation({
    summary: 'Obtener proyectos con búsqueda avanzada, filtros y paginación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de proyectos devuelta exitosamente.',
  })
  async obtenerProyectos(@Query() query: QueryProyectoDto) {
    return await this.proyectosService.obtenerTodos(query);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get('exportar/csv') // arriba de :id
  @ApiOperation({
    summary:
      'Descargar proyectos en CSV',
  })
  async exportarCsv(@Res() res: Response, @Query() query: QueryProyectoDto) {
    const csvContent = await this.proyectosService.exportarCsv(query);

    const sufijo = query.estado ? `_${query.estado.toLowerCase()}` : '_todos';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_proyectos${sufijo}.csv`,
    );

    res.status(HttpStatus.OK).send(csvContent);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get(':id/exportar/csv') // arriba de :id
  @ApiOperation({
    summary:
      'Descargar el detalle de un proyecto específico y sus tareas en formato CSV',
  })
  async exportarProyectoEspecificoCsv(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const csvContent =
      await this.proyectosService.exportarProyectoConTareasCsv(id);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=proyecto_${id}_tareas.csv`,
    );

    return res.status(HttpStatus.OK).send(csvContent);
  }

  // Obtener uno
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Proyecto encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proyecto no encontrado.',
  })
  async obtenerUnProyecto(@Param('id', ParseIntPipe) id: number) {
    return await this.proyectosService.obtenerPorId(id);
  }

  // Actualizar
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un proyecto existente' })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proyecto actualizado correctamente.',
    type: Proyecto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proyecto no encontrado.',
  })
  async actualizarProyecto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    return await this.proyectosService.actualizarProyecto(id, dto);
  }

  // Eliminar
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard, RolesGuard)
  @ROLES(RolUsuario.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un proyecto (Baja Lógica)' })
  @ApiParam({ name: 'id', description: 'ID del proyecto', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proyecto eliminado de forma correcta.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Proyecto no encontrado.',
  })
  async eliminarProyecto(@Param('id', ParseIntPipe) id: number) {
    return await this.proyectosService.eliminarProyecto(id);
  }
}
