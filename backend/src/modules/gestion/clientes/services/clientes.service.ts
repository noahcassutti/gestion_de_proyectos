import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from '../entities/cliente.entity';
import { EstadoCliente } from '../enum/estado-cliente-enum';
import { ClientesExportService } from './clientes-export/clientes-export.service'; 

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly exportService: ClientesExportService,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const nuevoCliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(nuevoCliente);
  }

  async findAll() {
    return await this.clienteRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`El cliente con ID ${id} no existe`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    this.clienteRepository.merge(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!cliente) {
      throw new NotFoundException(`El cliente con ID ${id} no existe`);
    }

    if (cliente.proyectos && cliente.proyectos.length > 0) {
      throw new BadRequestException(
        'No se puede dar de baja el cliente porque tiene proyectos vinculados.',
      );
    }
    cliente.estado = EstadoCliente.BAJA;
    return await this.clienteRepository.save(cliente);
  }

  async exportarClientesCsv(estado?: EstadoCliente): Promise<string> {
    return await this.exportService.exportarClientesCsv(estado);
  }
}
