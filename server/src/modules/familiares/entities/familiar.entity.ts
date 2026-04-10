import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@ObjectType()
@Entity('familiares')
export class Familiar {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  usuario_id: number;

  @Field(() => Int)
  @Column()
  familiar_id: number;

  @Field()
  @Column({ length: 80 })
  parentesco: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'familiar_id' })
  familiarUsuario: Usuario;
}
