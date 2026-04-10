import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('vacunas')
export class Vacuna {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  usuario_id: number;

  @Field()
  @Column({ length: 150 })
  nombre: string;

  @Field()
  @Column({ length: 100 })
  dosis_aplicada: string;

  @Field()
  @Column({ type: 'date' })
  fecha_aplicacion: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  proxima_dosis_fecha: string;

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
  @ManyToOne(() => Usuario, (usuario) => usuario.vacunas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
