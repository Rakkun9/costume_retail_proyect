import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prenda } from './prenda.entity';
import { CreatePrendaDto } from './dto/create-prenda.dto';
import { DomainEventPublisher } from '../patrones/observer/domain-event.publisher';

@Injectable()
export class PrendasService {
  constructor(
    @InjectRepository(Prenda)
    private readonly prendasRepository: Repository<Prenda>,
    private readonly domainEventPublisher: DomainEventPublisher,
  ) {}

  async create(dto: CreatePrendaDto): Promise<Prenda> {
    const existing = await this.prendasRepository.findOne({
      where: { referencia: dto.referencia },
    });
    if (existing) {
      throw new BadRequestException(
        `Ya existe una prenda con referencia ${dto.referencia}`,
      );
    }
    const prenda = this.prendasRepository.create(dto);
    return this.prendasRepository.save(prenda);
  }

  async findAll(): Promise<Prenda[]> {
    return this.prendasRepository.find();
  }

  async findByReferencia(referencia: string): Promise<Prenda> {
    const prenda = await this.prendasRepository.findOne({
      where: { referencia },
    });
    if (!prenda) {
      throw new NotFoundException(
        `Prenda con referencia ${referencia} no encontrada`,
      );
    }
    return prenda;
  }

  async findByTalla(
    talla: string,
  ): Promise<{ talla: string; tipos: Record<string, Prenda[]> }> {
    const prendas = await this.prendasRepository.find({ where: { talla } });
    const tipos: Record<string, Prenda[]> = {};
    for (const prenda of prendas) {
      if (!tipos[prenda.tipo]) {
        tipos[prenda.tipo] = [];
      }
      tipos[prenda.tipo].push(prenda);
    }
    return { talla, tipos };
  }

  async updateEstado(
    referencia: string,
    estado: Prenda['estado'],
  ): Promise<Prenda> {
    const prenda = await this.findByReferencia(referencia);
    prenda.estado = estado;
    const updated = await this.prendasRepository.save(prenda);

    await this.domainEventPublisher.notify({
      name: 'prenda.estado.actualizado',
      occurredOn: new Date(),
      payload: {
        referencia,
        estado,
      },
    });

    return updated;
  }
}
