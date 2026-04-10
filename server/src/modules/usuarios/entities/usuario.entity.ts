import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { CitaMedica } from '../../citas/entities/cita-medica.entity';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';
import { Vacuna } from '../../vacunas/entities/vacuna.entity';
import { Recordatorio } from '../../recordatorios/entities/recordatorio.entity';
import { Alerta } from '../../alertas/entities/alerta.entity';

export enum RolUsuario {
  USUARIO = 'usuario',
  FAMILIAR = 'familiar',
}

registerEnumType(RolUsuario, { name: 'RolUsuario' });

@ObjectType()
@Entity('usuarios')
export class Usuario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field()
  @Column({ length: 100 })
  apellido: string;

  @Field()
  @Column({ length: 150, unique: true })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @Field()
  @Column({ type: 'date' })
  fecha_nacimiento: string;

  @Field(() => RolUsuario)
  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.USUARIO })
  rol: RolUsuario;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [CitaMedica], { nullable: true })
  @OneToMany(() => CitaMedica, (cita) => cita.usuario)
  citas: CitaMedica[];

  @Field(() => [Medicamento], { nullable: true })
  @OneToMany(() => Medicamento, (med) => med.usuario)
  medicamentos: Medicamento[];

  @Field(() => [Vacuna], { nullable: true })
  @OneToMany(() => Vacuna, (vac) => vac.usuario)
  vacunas: Vacuna[];

  @Field(() => [Recordatorio], { nullable: true })
  @OneToMany(() => Recordatorio, (rec) => rec.usuario)
  recordatorios: Recordatorio[];

  @Field(() => [Alerta], { nullable: true })
  @OneToMany(() => Alerta, (al) => al.usuario)
  alertas: Alerta[];
}
