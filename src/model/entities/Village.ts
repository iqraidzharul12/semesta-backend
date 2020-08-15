import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { District, User, Stockies } from ".";

@Entity()
export class Village {
  @PrimaryColumn({ length: 10 })
  id: string;

  @Column()
  name: string;

  @ManyToOne((type) => District, (district) => district.villages)
  district: District;

  @OneToMany((type) => User, (user) => user.village)
  users: User[];

  @OneToMany((type) => Stockies, (stockies) => stockies.village)
  stockies: Stockies[];
}
