import { IProductionExist, IProductionState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Winning {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 30
  })
  name: string

  @Column()
  awardGrade: string

  @Column()
  awardLevel: string

  @Column()
  awardTime: Date

  @Column({
    length: 30
  })
  organizingCommittee: string

  @ManyToOne(() => User, (user) => user.win, { eager: true })
  applyWinUser: User

  @Column()
  winState: IProductionState

  @Column()
  winExist: IProductionExist

  @BeforeInsert()
  updateState() {
    this.winState = -1
    this.winExist = 1
  }

  @CreateDateColumn()
  createdTime: Date
}