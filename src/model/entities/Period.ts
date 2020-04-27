import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { MonthlyBonus } from '.';

@Entity()
export class Period {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  status: string;

  @OneToMany(type => MonthlyBonus, monthlyBonus => monthlyBonus.period)
  monthlyBonus: MonthlyBonus[];

  @Column()
  isActive: boolean;
}