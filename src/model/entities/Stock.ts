import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Stockies, Product } from ".";

@Entity()
export class Stock {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne((type) => Stockies, (stockies) => stockies.transactions)
  stockies: Stockies;

  @ManyToOne((type) => Product, (product) => product.transactions)
  product: Product;

  @Column()
  count: number;
}
