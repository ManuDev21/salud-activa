import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recordatorio, TipoRecordatorio, EstadoRecordatorio } from './entities/recordatorio.entity';

@Injectable()
export class RecordatoriosService {
  constructor(
    @InjectRepository(Recordatorio)
    private readonly repo: Repository<Recordatorio>,
  ) {}

  async findAll(): Promise<Recordatorio[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  async findByUsuario(usuarioId: number): Promise<Recordatorio[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
      order: { fecha_recordatorio: 'ASC' },
    });
  }

  async crearRecordatorioCita(usuarioId: number, citaId: number, fechaHora: Date): Promise<Recordatorio> {
    const rec = this.repo.create({
      usuario_id: usuarioId,
      tipo: TipoRecordatorio.CITA,
      referencia_id: citaId,
      fecha_recordatorio: fechaHora,
      estado: EstadoRecordatorio.ACTIVO,
    });
    return this.repo.save(rec);
  }

  async crearRecordatorioMedicamento(usuarioId: number, medId: number, fechaInicio: Date): Promise<Recordatorio> {
    const rec = this.repo.create({
      usuario_id: usuarioId,
      tipo: TipoRecordatorio.MEDICAMENTO,
      referencia_id: medId,
      fecha_recordatorio: fechaInicio,
      estado: EstadoRecordatorio.ACTIVO,
    });
    return this.repo.save(rec);
  }

  async crearRecordatorioVacuna(usuarioId: number, vacId: number, fecha: Date): Promise<Recordatorio> {
    const rec = this.repo.create({
      usuario_id: usuarioId,
      tipo: TipoRecordatorio.VACUNA,
      referencia_id: vacId,
      fecha_recordatorio: fecha,
      estado: EstadoRecordatorio.ACTIVO,
    });
    return this.repo.save(rec);
  }

  async marcarEnviado(id: number): Promise<Recordatorio> {
    await this.repo.update(id, { estado: EstadoRecordatorio.ENVIADO });
    return this.repo.findOne({ where: { id } });
  }
}
