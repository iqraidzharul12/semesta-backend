import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User, Stockies, Product, InternalMonthlyBonus } from ".";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  date: Date;

  @ManyToOne((type) => User, (user) => user.transactions)
  user: User;

  @ManyToOne((type) => Stockies, (stockies) => stockies.transactions)
  stockies: Stockies;

  @ManyToOne((type) => Product, (product) => product.transactions)
  product: Product;

  @OneToMany(
    (type) => InternalMonthlyBonus,
    (internalMonthlyBonus) => internalMonthlyBonus.transaction
  )
  internalMonthlyBonus: InternalMonthlyBonus[];

  @Column()
  count: number;
}
