import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm'; // ILike para buscar sin importar mayúsculas
import { Homonimo } from 'src/entities/homonimos/homonimos';
import { Ofac } from 'src/entities/ofac/ofac';
import { Onu } from 'src/entities/onu/onu';
import { Pep } from 'src/entities/pep/pep';
import { Sentenciados } from 'src/entities/sentenciados/sentenciados';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Homonimo)
    private homonimoRepository: Repository<Homonimo>,
    @InjectRepository(Ofac)
    private ofacRepository: Repository<Ofac>,
    @InjectRepository(Onu)
    private onuRepository: Repository<Onu>,
    @InjectRepository(Pep)
    private pepRepository: Repository<Pep>,
    @InjectRepository(Sentenciados)
    private sentenciadoRepository: Repository<Sentenciados>,
  ) {}
  
  async buscarHomonimo(termino: string,tipoConsulta:number) {
    if (!termino || termino.trim() === '') {
        return []; 
      }
      
    if(tipoConsulta==1){
        return await this.homonimoRepository.find({
        where: [
            { hom_identificacion: ILike(termino.trim()) }
        ],
        });
    }
    else{
        const palabras = termino.trim().split(/\s+/);
        const query = this.homonimoRepository.createQueryBuilder('homonimo');
    
        palabras.forEach((palabra, index) => {
        query.andWhere(`homonimo.hom_nombres ILIKE :palabra${index}`, { 
            [`palabra${index}`]: `%${palabra}%` 
        });
        });
       
        return await query.getMany();
    }
  }

  async buscarOnu(termino: string,tipoConsulta:number) {
    if (!termino || termino.trim() === '') {
        return []; 
      }
      if(tipoConsulta==1){
        return [];
    }
    else{
        const palabras = termino.trim().split(/\s+/);
        const query = this.onuRepository.createQueryBuilder('onu');
    
        palabras.forEach((palabra, index) => {
        query.andWhere(`onu.onu_nombres ILIKE :palabra${index}`, { 
            [`palabra${index}`]: `%${palabra}%` 
        });
        });
       
        return await query.getMany();
    }
  }

  async buscarOfac(termino: string, tipoConsulta:number) {
    if (!termino || termino.trim() === '') {
        return []; 
      }
    if(tipoConsulta==1){
        return [];
    }
    else{
        const palabras = termino.trim().split(/\s+/);
        const query = this.ofacRepository.createQueryBuilder('ofac');
    
        palabras.forEach((palabra, index) => {
        query.andWhere(`ofac.ofac_nombres ILIKE :palabra${index}`, { 
            [`palabra${index}`]: `%${palabra}%` 
        });
        });
       
        return await query.getMany();
    }
  }

  async buscarPep(termino: string,tipoConsulta:number) {
    if (!termino || termino.trim() === '') {
        return []; 
    }
    if(tipoConsulta==1){
        return await this.pepRepository.find({
        where: [
            { pep_identificacion: ILike(termino.trim()) }
        ],
        });
    }
    else{
        const palabras = termino.trim().split(/\s+/);
        const query = this.pepRepository.createQueryBuilder('pep');
    
        palabras.forEach((palabra, index) => {
        query.andWhere(`pep.pep_nombre ILIKE :palabra${index}`, { 
            [`palabra${index}`]: `%${palabra}%` 
        });
        });
       
        return await query.getMany();
    }
  }

  async buscarSentenciados(termino: string, tipoConsulta:number) {
    if (!termino || termino.trim() === '') {
      return [];
    }
    
    if(tipoConsulta==1){
        return await this.sentenciadoRepository.find({
            where: [
              { sent_identificacion: ILike(termino.trim()) }
            ],
          });
    }
    else{
        const palabras = termino.trim().split(/\s+/);
        const query = this.sentenciadoRepository.createQueryBuilder('sent');
    
        palabras.forEach((palabra, index) => {
        query.andWhere(`sent.sent_nombre ILIKE :palabra${index}`, { 
            [`palabra${index}`]: `%${palabra}%` 
        });
        });
       
        return await query.getMany();
    }
  }
}