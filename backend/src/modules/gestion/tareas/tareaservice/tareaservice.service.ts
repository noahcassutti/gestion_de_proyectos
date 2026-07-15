import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Tarea } from '../entities/tarea-entity';
import { EstadoTarea } from '../enum/estado-tareas-enum';
import { CreateTareaDto } from '../dtos/input/create-tarea-dto';
import { UpdateTareaDto } from '../dtos/input/update-tarea-dto';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { EstadoProyecto } from '../../proyectos/enum/estado-proyecto.enum';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepository: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private readonly proyectosRepository: Repository<Proyecto>,
  ) {}

  private async validarProyectoEditable(idProyecto: number): Promise<void> {
    const proyecto = await this.proyectosRepository.findOneBy({
      id: idProyecto,
    });
    if (!proyecto) {
      throw new NotFoundException(
        `El proyecto con ID ${idProyecto} no existe.`,
      );
    }

    if (
      proyecto.estado === EstadoProyecto.BAJA ||
      proyecto.estado === EstadoProyecto.FINALIZADO
    ) {
      throw new BadRequestException(
        'Operación denegada: El proyecto asociado se encuentra finalizado o dado de baja.',
      );
    }
  }

  async obtenerTareasParaCalendario() {
    return await this.tareasRepository.find({
      where: {
        fecha_inicio: Not(IsNull()),
      },
      relations: ['proyecto'],
      order: {
        fecha_inicio: 'ASC',
      },
    });
  }

  async crearTarea(dto: CreateTareaDto): Promise<{ id: number }> {
    await this.validarProyectoEditable(dto.id_proyecto);

    const tarea = this.tareasRepository.create({
      ...dto,
      estado: dto.estado || EstadoTarea.PENDIENTE,
    });

    await this.tareasRepository.save(tarea);
    return { id: tarea.id };
  }

  async obtenerTareasPorProyecto(idProyecto: number): Promise<Tarea[]> {
    return await this.tareasRepository.find({
      where: { id_proyecto: idProyecto },
      order: { id: 'ASC' },
    });
  }

  //actualizar tarea
  async actualizarTarea(dto: UpdateTareaDto, idTarea: number): Promise<void> {
    if (dto.estado === EstadoTarea.BAJA) {
      throw new BadRequestException(
        'Operación no permitida: No se puede dar de baja una tarea desde la edición. Utilice la función de eliminar.',
      );
    }
    const tarea = await this.tareasRepository.findOne({
      where: { id: idTarea },
      relations: ['proyecto'],
    });

    if (!tarea) {
      throw new BadRequestException('Tarea inexistente');
    }
    if (tarea.estado === EstadoTarea.BAJA) {
      throw new BadRequestException(
        'Operación denegada: La tarea se encuentra dada de baja y no puede ser modificada ni reactivada.',
      );
    }

    await this.validarProyectoEditable(tarea.proyecto.id);

    this.tareasRepository.merge(tarea, dto);
    await this.tareasRepository.save(tarea);
  }

  async eliminarTarea(idTarea: number): Promise<void> {
    const tarea = await this.tareasRepository.findOne({
      where: { id: idTarea },
      relations: ['proyecto'],
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada');
    }

    await this.validarProyectoEditable(tarea.proyecto.id);

    tarea.estado = EstadoTarea.BAJA;
    await this.tareasRepository.save(tarea);
  }
}
