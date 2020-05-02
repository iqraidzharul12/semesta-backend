import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User, Period } from '.';

@Entity()
export class MonthlyBonus {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(type => User, user => user.monthlyBonus)
  user: User;

  @ManyToOne(type => Period, period => period.monthlyBonus)
  period: Period;

  @Column({default: 0})
  level0: number;

  @Column({default: 0})
  level1: number;

  @Column({default: 0})
  level2: number;

  @Column({default: 0})
  level3: number;

  @Column({default: 0})
  level4: number;

  @Column({default: 0})
  level5: number;

  @Column({default: 0})
  level6: number;

  @Column({default: 0})
  level7: number;

  @Column({default: 0})
  level8: number;

  @Column({default: 0})
  level9: number;

  @Column({default: 0})
  level10: number;

  @Column({default: 0})
  totalBonus: number;

  @Column()
  isActive: boolean;
}