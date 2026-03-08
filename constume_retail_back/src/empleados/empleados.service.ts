import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadosRepository: Repository<Empleado>,
  ) {}

  async create(dto: CreateEmpleadoDto): Promise<Empleado> {
    const existing = await this.empleadosRepository.findOne({
      where: { numero_identificacion: dto.numero_identificacion },
    });
    if (existing) {
      throw new BadRequestException(
        `Ya existe un empleado con identificación ${dto.numero_identificacion}`,
      );
    }
    const empleado = this.empleadosRepository.create(dto);
    return this.empleadosRepository.save(empleado);
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.find();
  }

  async findById(numero_identificacion: string): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOne({
      where: { numero_identificacion },
    });
    if (!empleado) {
      throw new NotFoundException(
        `Empleado con identificación ${numero_identificacion} no encontrado`,
      );
    }
    return empleado;
  }
}
