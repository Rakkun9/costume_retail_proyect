import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prenda } from '../prendas/prenda.entity';

@Entity('lista_lavanderia')
export class ListaLavanderia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Prenda, (prenda) => prenda.listaLavanderia)
  @JoinColumn({ name: 'prenda_referencia' })
  prenda: Prenda;

  @Column({ default: false })
  prioridad: boolean;

  @CreateDateColumn()
  fecha_registro: Date;

  @Column({ default: false })
  enviada: boolean;
}
