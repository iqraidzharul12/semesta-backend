import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { MonthlyBonus, Product, MonthlyLevelBonus } from ".";

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

  @OneToMany((type) => MonthlyBonus, (monthlyBonus) => monthlyBonus.period)
  monthlyBonus: MonthlyBonus[];

  @OneToMany(
    (type) => MonthlyLevelBonus,
    (monthlyLevelBonus) => monthlyLevelBonus.period
  )
  monthlyLevelBonus: MonthlyLevelBonus[];

  @OneToMany((type) => Product, (product) => product.period)
  products: Product[];

  @Column()
  isActive: boolean;
}
