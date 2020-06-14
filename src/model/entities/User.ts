import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Transaction, MonthlyBonus } from '.';

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Column({unique: true})
  username: string;

  @Column({nullable: true})
  fullName: string;

  @Column()
  key: string;

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