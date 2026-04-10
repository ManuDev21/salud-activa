import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.repo.find({ relations: ['citas', 'medicamentos', 'vacunas'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['citas', 'medicamentos', 'vacunas', 'recordatorios', 'alertas'],
    });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return user;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.repo.findOne({ where: { correo } });
  }

  async create(input: CreateUsuarioInput): Promise<Usuario> {
    const exists = await this.findByCorreo(input.correo);
    if (exists) throw new ConflictException('El correo ya está registrado');
    const user = this.repo.create(input);
    return this.repo.save(user);
  }

  async update(input: UpdateUsuarioInput): Promise<Usuario> {
    await this.findOne(input.id);
    await this.repo.update(input.id, input);
    return this.findOne(input.id);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id);
    await this.repo.delete(id);
    return true;
  }
}
