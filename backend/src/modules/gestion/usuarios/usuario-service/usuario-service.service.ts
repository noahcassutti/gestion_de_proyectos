import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoUsuario } from '../enum/estado-usurio.enum';
import { Usuario } from '../entities/input/usuario-entities';

@Injectable()
export class UsuarioServiceService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: { estado: EstadoUsuario.ACTIVO },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({ id });
  }

  async findByNombre(nombre: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({
      nombre 
    });
  }

}
