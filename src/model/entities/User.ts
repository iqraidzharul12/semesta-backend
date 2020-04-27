import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Transaction, MonthlyBonus } from '.';

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @MinLength(8)
  password: string;

  @ManyToOne(type => User, user => user.downLines)
  upLine: User;

  @OneToMany(type=> User, user => user.upLine)
  downLines: User[];

  @OneToMany(type => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(type => MonthlyBonus, monthlyBonus => monthlyBonus.user)
  monthlyBonus: MonthlyBonus[];

  @Column()
  isActive: boolean;

  
}