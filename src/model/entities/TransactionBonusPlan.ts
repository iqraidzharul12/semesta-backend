import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from '.';

@Entity()
export class TransactionBonusPlan {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  level0: number;

  @Column()
  level1: number;

  @Column()
  level2: number;

  @Column()
  level3: number;

  @Column()
  level4: number;

  @Column()
  level5: number;

  @Column()
  level6: number;

  @Column()
  level7: number;

  @Column()
  level8: number;

  @Column()
  level9: number;

  @Column()
  level10: number;

  @Column()
  totalBonus: number;

  @OneToMany(type => Product, product => product.bonusPlan)
  products: Product[];

  @Column()
  isActive: boolean;
}