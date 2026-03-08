import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const existing = await this.clientesRepository.findOne({
      where: { numero_identificacion: dto.numero_identificacion },
    });
    if (existing) {
      throw new BadRequestException(
        `Ya existe un cliente con identificación ${dto.numero_identificacion}`,
      );
    }
    const cliente = this.clientesRepository.create(dto);
    return this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  async findById(numero_identificacion: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { numero_identificacion },
    });
    if (!cliente) {
      throw new NotFoundException(
        `Cliente con identificación ${numero_identificacion} no encontrado`,
      );
    }
    return cliente;
  }
}
