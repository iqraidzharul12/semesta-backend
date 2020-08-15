import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User, Period, Transaction } from '.';

@Entity()
export class InternalMonthlyBonus {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(type => User, user => user.monthlyBonus)
  user: User;

  @ManyToOne(type => Period, period => period.monthlyBonus)
  period: Period;

  @Column({default: 0})
  totalBonus: number;

  @ManyToOne(type => Transaction, transaction => transaction.internalMonthlyBonus)
  transaction: Transaction;

  @Column()
  isActive: boolean;
}