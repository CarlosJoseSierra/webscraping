import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sentenciados') // Nombre exacto de la tabla en tu DB
export class Sentenciados {
  @PrimaryGeneratedColumn()
  sent_id: number;

  @Column()
  sent_identificacion: string;

  @Column()
  sent_nombre: string;

  @Column()
  sent_nacionalidad: string;
}

