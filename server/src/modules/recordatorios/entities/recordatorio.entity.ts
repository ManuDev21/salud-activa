import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoRecordatorio {
  CITA = 'cita',
  MEDICAMENTO = 'medicamento',
  VACUNA = 'vacuna',
}

export enum EstadoRecordatorio {
  ACTIVO = 'activo',
  ENVIADO = 'enviado',
}

registerEnumType(TipoRecordatorio, { name: 'TipoRecordatorio' });
registerEnumType(EstadoRecordatorio, { name: 'EstadoRecordatorio' });

@ObjectType()
@Entity('recordatorios')
export class Recordatorio {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  usuario_id: number;

  @Field(() => TipoRecordatorio)
  @Column({ type: 'enum', enum: TipoRecordatorio })
  tipo: TipoRecordatorio;

  @Field(() => Int)
  @Column()
  referencia_id: number;

  @Field()
  @Column({ type: 'timestamp' })
  fecha_recordatorio: Date;

  @Field(() => EstadoRecordatorio)
  @Column({ type: 'enum', enum: EstadoRecordatorio, default: EstadoRecordatorio.ACTIVO })
  estado: EstadoRecordatorio;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.recordatorios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
