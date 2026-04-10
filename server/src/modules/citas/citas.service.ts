import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitaMedica, EstadoCita } from './entities/cita-medica.entity';
import { CreateCitaInput } from './dto/create-cita.input';
import { UpdateCitaInput } from './dto/update-cita.input';
import { RecordatoriosService } from '../recordatorios/recordatorios.service';
import { AlertasService } from '../alertas/alertas.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(CitaMedica)
    private readonly repo: Repository<CitaMedica>,
    private readonly recordatoriosService: RecordatoriosService,
    private readonly alertasService: AlertasService,
  ) {}

  async findAll(): Promise<CitaMedica[]> {
    return this.repo.find({ relations: ['usuario'], order: { fecha_hora: 'ASC' } });
  }

  async findOne(id: number): Promise<CitaMedica> {
    const cita = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!cita) throw new NotFoundException(`Cita #${id} no encontrada`);
    return cita;
  }

  async findByUsuario(usuarioId: number): Promise<CitaMedica[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
      order: { fecha_hora: 'ASC' },
    });
  }

  async create(input: CreateCitaInput): Promise<CitaMedica> {
    const cita = this.repo.create(input);
    const saved = await this.repo.save(cita);

    // Auto-Recordatorio: generar recordatorio al crear cita
    await this.recordatoriosService.crearRecordatorioCita(
      saved.usuario_id,
      saved.id,
      new Date(saved.fecha_hora),
    );

    return this.findOne(saved.id);
  }

  async update(input: UpdateCitaInput): Promise<CitaMedica> {
    const { id, ...data } = input;
    const cita = await this.findOne(id);
    Object.assign(cita, data);
    await this.repo.save(cita);
    const updated = await this.findOne(id);

    // Alerta de Incumplimiento: si estado es pendiente y fecha es pasada
    if (updated.estado === EstadoCita.PENDIENTE && new Date(updated.fecha_hora) < new Date()) {
      await this.alertasService.crearAlertaIncumplimiento(
        updated.usuario_id,
        'cita_incumplida',
        `La cita con ${updated.medico} (${updated.especialidad}) del ${updated.fecha_hora} no fue completada.`,
      );
    }

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.repo.delete(id);
    return true;
  }
}
