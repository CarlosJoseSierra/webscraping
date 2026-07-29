import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('homonimos') // Nombre exacto de la tabla en tu DB
export class Homonimo {
  @PrimaryGeneratedColumn()
  hom_id: number;

  @Column()
  hom_identificacion: string;

  @Column()
  hom_nombres: string;

  @Column()
  hom_nacionalidad: string;
}