import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Transaction } from '.';
import { TransactionBonusPlan } from './TransactionBonusPlan';

@Entity()
export class Product {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @Column()
  buy_price: number;

  @Column()
  sell_price: number;

  @OneToMany(type => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @ManyToOne(type => TransactionBonusPlan, bonusPlan => bonusPlan.products)
  bonusPlan: TransactionBonusPlan;

  @Column({nullable: true})
  description: string;

  @Column()
  isActive: boolean;
}