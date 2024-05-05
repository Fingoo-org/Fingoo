import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MemberEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;
}
