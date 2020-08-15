import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { IsEmail, MinLength } from "class-validator";
import {
  Transaction,
  MonthlyBonus,
  Stockies,
  MonthlyLevelBonus,
  Village,
} from ".";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  key: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne((type) => User, (user) => user.downLines)
  upLine: User;

  @OneToMany((type) => User, (user) => user.upLine)
  downLines: User[];

  @OneToMany((type) => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany((type) => MonthlyBonus, (monthlyBonus) => monthlyBonus.user)
  monthlyBonus: MonthlyBonus[];

  @OneToMany(
    (type) => MonthlyLevelBonus,
    (monthlyLevelBonus) => monthlyLevelBonus.user
  )
  monthlyLevelBonus: MonthlyLevelBonus[];

  @ManyToOne((type) => Stockies, (stockies) => stockies.userList)
  stockiesReferal: Stockies;

  @ManyToOne((type) => User, (user) => user.sponsored)
  sponsor: User;

  @OneToMany((type) => User, (user) => user.sponsor)
  sponsored: User[];

  @ManyToOne((type) => Village, (village) => village.users)
  village: Village;

  @Column({ nullable: true })
  userLevel: string;

  @Column({ nullable: true })
  activatedAt: Date;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column()
  isActive: boolean;
}
