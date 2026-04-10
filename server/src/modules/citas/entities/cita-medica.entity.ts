import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  COMPLETADA = 'completada',
}

registerEnumType(EstadoCita, { name: 'EstadoCita' });

@ObjectType()
@Entity('citas_medicas')
export class CitaMedica {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  usuario_id: number;

  @Field()
  @Column({ length: 150 })
  medico: string;

  @Field()
  @Column({ length: 100 })
  especialidad: string;

  @Field()
  @Column({ length: 200 })
  lugar: string;

  @Field()
  @Column({ type: 'datetime' })
  fecha_hora: Date;

  @Field(() => EstadoCita)
  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notas: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.citas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
