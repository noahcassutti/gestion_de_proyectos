import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../entities/proyecto.entity';
import { QueryProyectoDto } from '../dtos/input/query-proyecto.dto';
import { generarArchivoCsv } from '../../../../common/utils/csv-generator.util';

@Injectable()
export class ProyectosExportService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectosRepository: Repository<Proyecto>,
  ) {}

  async exportarAStrCsv(query: QueryProyectoDto): Promise<string> {
    const { search, estado } = query;

    const qb = this.proyectosRepository
      .createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.cliente', 'cliente')
      .orderBy('proyecto.id', 'ASC');

    if (search) {
      qb.andWhere('proyecto.nombre ILIKE :search', { search: `%${search}%` });
    }
    if (estado) {
      qb.andWhere('CAST(proyecto.estado AS text) = :estado', { estado });
    }

    const proyectos = await qb.getMany();

    const encabezados = [
      'ID',
      'Nombre Proyecto',
      'Estado',
      'Cliente Asignado',
      'Teléfono Cliente',
      'Correo Cliente',
    ];

    const matrizDeDatos = proyectos.map((p) => [
      p.id,
      p.nombre,
      p.estado,
      p.cliente ? p.cliente.nombre : 'Proyecto Interno',
      p.cliente?.telefono || 'N/A',
      p.cliente?.correo || 'N/A',
    ]);

    return generarArchivoCsv(encabezados, matrizDeDatos);
  }
  async exportarProyectoConTareasCsv(idProyecto: number): Promise<string> {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id: idProyecto },
      relations: ['tareas'],
    });

    if (!proyecto) {
      throw new NotFoundException(`El proyecto con ID ${idProyecto} no existe`);
    }

    const encabezados = [
      'ID Tarea',
      'Descripción',
      'Estado',
      'fecha_inicio',
      'fecha_limite',
      'ID Proyecto',
      'Nombre Proyecto',
    ];

    if (!proyecto.tareas || proyecto.tareas.length === 0) {
      return generarArchivoCsv(encabezados, [
        [
          'N/A',
          'El proyecto no tiene tareas registradas',
          'N/A',
          'N/A',
          'N/A',
          proyecto.id,
          proyecto.nombre,
        ],
      ]);
    }

    const matrizDeDatos = proyecto.tareas.map((t) => [
      t.id,
      t.descripcion,
      t.estado,
      t.fecha_inicio,
      t.fecha_limite,
      proyecto.id,
      proyecto.nombre,
    ]);

    return generarArchivoCsv(encabezados, matrizDeDatos);
  }
}
