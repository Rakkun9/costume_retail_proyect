import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { Empleado } from '../empleados/empleado.entity';
import { Prenda } from '../prendas/prenda.entity';

@Entity('servicios_alquiler')
export class ServicioAlquiler {
  @PrimaryGeneratedColumn()
  numero_servicio: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Empleado, (empleado) => empleado.servicios)
  @JoinColumn({ name: 'empleado_id' })
  empleado: Empleado;

  @ManyToMany(() => Prenda, (prenda) => prenda.servicios)
  @JoinTable({ name: 'servicio_prendas' })
  prendas: Prenda[];

  @Column({ type: 'date' })
  fecha_alquiler: string;

  @CreateDateColumn()
  fecha_solicitud: Date;
}
