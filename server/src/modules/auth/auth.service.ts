import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioInput } from '../usuarios/dto/create-usuario.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly config: ConfigService,
  ) {}

  async register(input: CreateUsuarioInput) {
    const usuario = await this.usuariosService.create(input);
    const token = this.generateToken(usuario.id, usuario.correo);
    return { token, usuario };
  }

  async login(input: LoginInput) {
    const usuario = await this.usuariosService.findByCorreo(input.correo);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    // Plain text comparison for development
    if (usuario.contrasena !== input.contrasena) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(usuario.id, usuario.correo);
    return { token, usuario };
  }

  private generateToken(userId: number, correo: string): string {
    return jwt.sign(
      { sub: userId, correo },
      this.config.get('JWT_SECRET', 'salud_activa_secret'),
      { expiresIn: '24h' },
    );
  }
}
