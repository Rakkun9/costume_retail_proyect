import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('empleados')
export class Empleado {
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
  cargo: string;

  @OneToMany('ServicioAlquiler', 'empleado')
  servicios: any[];
}
