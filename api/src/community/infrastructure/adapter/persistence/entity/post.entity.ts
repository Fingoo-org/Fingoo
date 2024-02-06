import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;
}
