import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { CreateMedicamentoInput } from './dto/create-medicamento.input';
import { UpdateMedicamentoInput } from './dto/update-medicamento.input';
import { RecordatoriosService } from '../recordatorios/recordatorios.service';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly repo: Repository<Medicamento>,
    private readonly recordatoriosService: RecordatoriosService,
  ) {}

  async findAll(): Promise<Medicamento[]> {
    return this.repo.find({ relations: ['usuario'], order: { fecha_inicio: 'ASC' } });
  }

  async findOne(id: number): Promise<Medicamento> {
    const med = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!med) throw new NotFoundException(`Medicamento #${id} no encontrado`);
    return med;
  }

  async findByUsuario(usuarioId: number): Promise<Medicamento[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
      order: { fecha_inicio: 'ASC' },
    });
  }

  async create(input: CreateMedicamentoInput): Promise<Medicamento> {
    const med = this.repo.create(input);
    const saved = await this.repo.save(med);

    // Auto-Recordatorio: generar recordatorio al crear medicamento
    await this.recordatoriosService.crearRecordatorioMedicamento(
      saved.usuario_id,
      saved.id,
      new Date(saved.fecha_inicio),
    );

    return this.findOne(saved.id);
  }

  async update(input: UpdateMedicamentoInput): Promise<Medicamento> {
    const { id, ...data } = input;
    const med = await this.findOne(id);
    Object.assign(med, data);
    await this.repo.save(med);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.repo.delete(id);
    return true;
  }
}
