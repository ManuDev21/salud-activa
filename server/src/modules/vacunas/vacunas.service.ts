import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacuna } from './entities/vacuna.entity';
import { CreateVacunaInput } from './dto/create-vacuna.input';
import { UpdateVacunaInput } from './dto/update-vacuna.input';
import { RecordatoriosService } from '../recordatorios/recordatorios.service';

@Injectable()
export class VacunasService {
  constructor(
    @InjectRepository(Vacuna)
    private readonly repo: Repository<Vacuna>,
    private readonly recordatoriosService: RecordatoriosService,
  ) {}

  async findAll(): Promise<Vacuna[]> {
    return this.repo.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Vacuna> {
    const vac = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!vac) throw new NotFoundException(`Vacuna #${id} no encontrada`);
    return vac;
  }

  async findByUsuario(usuarioId: number): Promise<Vacuna[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario'],
    });
  }

  async create(input: CreateVacunaInput): Promise<Vacuna> {
    const vac = this.repo.create(input);
    const saved = await this.repo.save(vac);

    if (saved.proxima_dosis_fecha) {
      await this.recordatoriosService.crearRecordatorioVacuna(
        saved.usuario_id,
        saved.id,
        new Date(saved.proxima_dosis_fecha),
      );
    }

    return this.findOne(saved.id);
  }

  async update(input: UpdateVacunaInput): Promise<Vacuna> {
    const { id, ...data } = input;
    const vac = await this.findOne(id);
    Object.assign(vac, data);
    await this.repo.save(vac);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.repo.delete(id);
    return true;
  }
}
