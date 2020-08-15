import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Regency } from ".";

@Entity()
export class Province {
  @PrimaryColumn({ length: 2 })
  id: string;

  @Column()
  name: string;

  @OneToMany((type) => Regency, (regency) => regency.province)
  regencies: Regency[];
}
