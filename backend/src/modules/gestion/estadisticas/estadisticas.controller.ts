import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service';
import { AuthGuardGuard } from '../../auth/guards/auth-guard.guard'; // Ajusta la ruta

@ApiTags('Dashboard y Estadísticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuardGuard)
  @Get('resumen')
  @ApiOperation({ summary: 'Obtiene las métricas generales del sistema para el Dashboard' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estadísticas generadas correctamente.' })
  async obtenerResumen() {
    return await this.estadisticasService.obtenerResumenGeneral();
  }
}
