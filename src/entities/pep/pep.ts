import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pep') // Nombre exacto de la tabla en tu DB
export class Pep {
  @PrimaryGeneratedColumn()
  pep_id: number;

  @Column()
  pep_identificacion: string;

  @Column()
  pep_nombre: string;

  @Column()
  pep_denominacion: string;

  @Column()
  pep_entidad: string;
}

