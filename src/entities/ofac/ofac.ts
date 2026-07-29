import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ofac') // Nombre exacto de la tabla en tu DB
export class Ofac {
  @PrimaryGeneratedColumn()
  ofac_id: number;

  @Column({ name: 'ofac_nombres' })
  ofac_nombres: string;

}
