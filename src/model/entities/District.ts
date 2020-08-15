import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { Regency, Village } from ".";

@Entity()
export class District {
  @PrimaryColumn({ length: 7 })
  id: string;

  @Column()
  name: string;

  @ManyToOne((type) => Regency, (regency) => regency.districts)
  regency: Regency;

  @OneToMany((type) => Village, (village) => village.district)
  villages: Village[];
}
