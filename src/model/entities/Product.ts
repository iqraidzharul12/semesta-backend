import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Transaction, StockiesPurchase, Period } from ".";
import { TransactionBonusPlan } from "./TransactionBonusPlan";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column()
  weight: number;

  @Column()
  buyPrice: number;

  @Column()
  stockiesPrice: number;

  @Column()
  sellPrice: number;

  @Column({ nullable: true })
  variation: String;

  @OneToMany((type) => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany((type) => StockiesPurchase, (purchase) => purchase.product)
  purchases: StockiesPurchase[];

  @ManyToOne((type) => TransactionBonusPlan, (bonusPlan) => bonusPlan.products)
  bonusPlan: TransactionBonusPlan;

  @ManyToOne((type) => Period, (period) => period.products)
  period: Period;

  @Column({ nullable: true })
  description: string;

  @Column()
  isActive: boolean;
}
