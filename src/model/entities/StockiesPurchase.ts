import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Stockies, Product } from ".";

@Entity()
export class StockiesPurchase {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  date: Date;

  @ManyToOne((type) => Stockies, (stockies) => stockies.purchases)
  stockies: Stockies;

  @ManyToOne((type) => Product, (product) => product.purchases)
  product: Product;

  @Column()
  count: number;
}
