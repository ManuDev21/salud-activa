import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from './entities/alerta.entity';
import { Familiar } from '../familiares/entities/familiar.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alerta)
    private readonly repo: Repository<Alerta>,
    @InjectRepository(Familiar)
    private readonly familiarRepo: Repository<Familiar>,
  ) {}

  async findAll(): Promise<Alerta[]> {
    return this.repo.find({ relations: ['usuario', 'familiarUsuario'] });
  }

  async findByUsuario(usuarioId: number): Promise<Alerta[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario', 'familiarUsuario'],
      order: { created_at: 'DESC' },
    });
  }

  async crearAlertaIncumplimiento(usuarioId: number, tipo: string, mensaje: string): Promise<Alerta> {
    const familiares = await this.familiarRepo.find({ where: { usuario_id: usuarioId } });
    const familiarId = familiares.length > 0 ? familiares[0].familiar_id : null;

    const alerta = this.repo.create({
      usuario_id: usuarioId,
      familiar_id: familiarId,
      tipo,
      mensaje,
      leida: false,
    });
    return this.repo.save(alerta);
  }

  async marcarLeida(id: number): Promise<Alerta> {
    await this.repo.update(id, { leida: true });
    return this.repo.findOne({ where: { id }, relations: ['usuario', 'familiarUsuario'] });
  }
}
