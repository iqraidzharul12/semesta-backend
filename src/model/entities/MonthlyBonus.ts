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

  @Column()
  isActive: boolean;
}