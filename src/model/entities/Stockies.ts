import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User, Transaction } from '.';

@Entity()
export class Stockies {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column()
  currentStock: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToMany(type => Transaction, transaction => transaction.user)
  transactions: Transaction[];
  
  @Column()
  isActive: boolean;
}