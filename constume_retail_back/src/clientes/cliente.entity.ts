import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryColumn()
  numero_identificacion: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  direccion: string;

  @OneToMany('ServicioAlquiler', 'cliente')
  servicios: any[];
}
