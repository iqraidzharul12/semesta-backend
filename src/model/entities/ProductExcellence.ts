import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductExcellence {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;
}