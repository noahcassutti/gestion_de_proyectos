import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  Res,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';

import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ClienteService } from '../services/clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { AuthGuardGuard } from '../../../auth/guards/auth-guard.guard'; // Verifica que esta ruta sea la correcta en tu árbol
import { EstadoCliente } from '../enum/estado-cliente-enum';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  //crear cliente
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cliente creado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos.',
  })
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clienteService.create(createClienteDto);
  }

  //get todos los clientes
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de clientes devuelta exitosamente.',
  })
  async findAll() {
    return await this.clienteService.findAll();
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get('exportar/csv')
  @ApiOperation({
    summary:
      'Descargar listado de clientes en CSV',
  })
  async exportarCsv(
    @Res() res: Response,
    @Query('estado') estado?: EstadoCliente,
  ) {
    const csvContent = await this.clienteService.exportarClientesCsv(estado);

    const nombreArchivo = estado
      ? `reporte_clientes_${estado.toLowerCase()}.csv`
      : 'reporte_clientes_todos.csv';

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${nombreArchivo}`,
    );
    res.status(HttpStatus.OK).send(csvContent);
  }

  // get cliente por id
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clienteService.findOne(id);
  }

  // actualizar cliente
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a modificar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente actualizado correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return await this.clienteService.update(id, updateClienteDto);
  }

  // eliminar cliente
  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente eliminado correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.clienteService.remove(id);
  }
}
