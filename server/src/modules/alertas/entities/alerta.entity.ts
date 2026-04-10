import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('alertas')
export class Alerta {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  usuario_id: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  familiar_id: number;

  @Field()
  @Column({ length: 80 })
  tipo: string;

  @Field()
  @Column({ type: 'text' })
  mensaje: string;

  @Field()
  @Column({ default: false })
  leida: boolean;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.alertas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Field(() => Usuario, { nullable: true })
  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'familiar_id' })
  familiarUsuario: Usuario;
}
