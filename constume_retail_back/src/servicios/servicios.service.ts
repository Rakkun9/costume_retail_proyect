import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicioAlquiler } from './servicio-alquiler.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { ClientesService } from '../clientes/clientes.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { PrendasService } from '../prendas/prendas.service';
import { EstadoPrenda, Prenda } from '../prendas/prenda.entity';
import { PrendaReferenceIterator } from '../patrones/iterator/prenda-reference.iterator';
import { DomainEventPublisher } from '../patrones/observer/domain-event.publisher';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(ServicioAlquiler)
    private readonly serviciosRepository: Repository<ServicioAlquiler>,
    private readonly clientesService: ClientesService,
    private readonly empleadosService: EmpleadosService,
    private readonly prendasService: PrendasService,
    private readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  async create(dto: CreateServicioDto): Promise<ServicioAlquiler> {
    const cliente = await this.clientesService.findById(dto.cliente_id);
    const empleado = await this.empleadosService.findById(dto.empleado_id);

    const prendas: Prenda[] = [];
    const iterator = new PrendaReferenceIterator(dto.referencias_prendas);

    while (iterator.hasNext()) {
      const referencia = iterator.next();
      const prenda = await this.prendasService.findByReferencia(referencia);

      if (prenda.estado === EstadoPrenda.EN_LAVANDERIA) {
        throw new BadRequestException(
          `La prenda "${referencia}" se encuentra en lavandería y no está disponible`,
        );
      }

      // Verificar que la prenda no esté ya reservada para la misma fecha
      const conflicto = await this.serviciosRepository
        .createQueryBuilder('servicio')
        .innerJoin('servicio.prendas', 'prenda')
        .where('prenda.referencia = :referencia', { referencia })
        .andWhere('servicio.fecha_alquiler = :fecha', {
          fecha: dto.fecha_alquiler,
        })
        .getOne();

      if (conflicto) {
        throw new BadRequestException(
          `La prenda "${referencia}" ya está reservada para el ${dto.fecha_alquiler} en el servicio #${conflicto.numero_servicio}`,
        );
      }

      prendas.push(prenda);
    }

    const servicio = this.serviciosRepository.create({
      cliente,
      empleado,
      prendas,
      fecha_alquiler: dto.fecha_alquiler,
    });

    const saved = await this.serviciosRepository.save(servicio);

    await this.domainEventPublisher.notify({
      name: 'servicio.alquiler.creado',
      occurredOn: new Date(),
      payload: {
        numero_servicio: saved.numero_servicio,
        cliente_id: dto.cliente_id,
        empleado_id: dto.empleado_id,
        fecha_alquiler: dto.fecha_alquiler,
        total_prendas: prendas.length,
      },
    });

    return saved;
  }

  async findByNumero(numero: number): Promise<ServicioAlquiler> {
    const servicio = await this.serviciosRepository.findOne({
      where: { numero_servicio: numero },
      relations: ['cliente', 'empleado', 'prendas'],
    });
    if (!servicio) {
      throw new NotFoundException(
        `Servicio de alquiler #${numero} no encontrado`,
      );
    }
    return servicio;
  }

  async findByCliente(
    clienteId: string,
  ): Promise<{ cliente: any; servicios: ServicioAlquiler[] }> {
    const cliente = await this.clientesService.findById(clienteId);
    const today = new Date().toISOString().split('T')[0];

    const servicios = await this.serviciosRepository
      .createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.prendas', 'prenda')
      .leftJoinAndSelect('servicio.empleado', 'empleado')
      .leftJoinAndSelect('servicio.cliente', 'cliente')
      .where('cliente.numero_identificacion = :clienteId', { clienteId })
      .andWhere('servicio.fecha_alquiler >= :today', { today })
      .orderBy('servicio.fecha_alquiler', 'ASC')
      .getMany();

    return { cliente, servicios };
  }

  async findByFecha(fecha: string): Promise<ServicioAlquiler[]> {
    return this.serviciosRepository.find({
      where: { fecha_alquiler: fecha },
      relations: ['cliente', 'empleado', 'prendas'],
    });
  }
}
