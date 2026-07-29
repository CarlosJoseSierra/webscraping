import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('onu') // Nombre exacto de la tabla en tu DB
export class Onu {
  @PrimaryGeneratedColumn()
  onu_id: number;

  @Column()
  onu_nombres: string;
}

