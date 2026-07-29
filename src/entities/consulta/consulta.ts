import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string;

  @Column('text')
  resultado_scraping: string;

  @Column()
  url_captura: string;

  @CreateDateColumn()
  fecha_consulta: Date;
}