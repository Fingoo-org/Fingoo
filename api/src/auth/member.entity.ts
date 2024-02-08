import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
