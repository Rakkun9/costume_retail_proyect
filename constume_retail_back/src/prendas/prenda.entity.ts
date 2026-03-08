import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

export enum EstadoPrenda {
  DISPONIBLE = 'DISPONIBLE',
  ALQUILADA = 'ALQUILADA',
  EN_LAVANDERIA = 'EN_LAVANDERIA',
}

@Entity('prendas')
export class Prenda {
  @PrimaryColumn()
  referencia: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  talla: string;

  @Column()
  tipo: string;

  @Column({
    type: 'enum',
    enum: EstadoPrenda,
    default: EstadoPrenda.DISPONIBLE,
  })
  estado: EstadoPrenda;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_alquiler: number;

  @ManyToMany('ServicioAlquiler', 'prendas')
  servicios: any[];

  @OneToMany('ListaLavanderia', 'prenda')
  listaLavanderia: any[];
}
