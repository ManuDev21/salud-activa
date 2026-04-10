import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Familiar } from './entities/familiar.entity';
import { CreateFamiliarInput } from './dto/create-familiar.input';

@Injectable()
export class FamiliaresService {
  constructor(
    @InjectRepository(Familiar)
    private readonly repo: Repository<Familiar>,
  ) {}

  async findAll(): Promise<Familiar[]> {
    return this.repo.find({ relations: ['usuario', 'familiarUsuario'] });
  }

  async findByUsuario(usuarioId: number): Promise<Familiar[]> {
    return this.repo.find({
      where: { usuario_id: usuarioId },
      relations: ['usuario', 'familiarUsuario'],
    });
  }

  async create(input: CreateFamiliarInput): Promise<Familiar> {
    const fam = this.repo.create(input);
    const saved = await this.repo.save(fam);
    return this.repo.findOne({ where: { id: saved.id }, relations: ['usuario', 'familiarUsuario'] });
  }

  async remove(id: number): Promise<boolean> {
    const fam = await this.repo.findOne({ where: { id } });
    if (!fam) throw new NotFoundException(`Familiar #${id} no encontrado`);
    await this.repo.delete(id);
    return true;
  }
}
