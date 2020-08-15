import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { Province, District } from ".";

@Entity()
export class Regency {
  @PrimaryColumn({ length: 4 })
  id: string;

  @Column()
  name: string;

  @ManyToOne((type) => Province, (province) => province.regencies)
  province: Province;

  @OneToMany((type) => District, (district) => district.regency)
  districts: District[];
}
