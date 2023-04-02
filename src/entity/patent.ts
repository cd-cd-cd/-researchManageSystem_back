import { IProductionExist, IProductionState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Patent {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 25
  })
  name: string

  @Column({
    length: 13
  })
  applicationNumber: string

  @Column()
  applicationDate: Date

  @Column({
    length: 12
  })
  publicationNumber: string

  @Column()
  openDay: Date

  @Column({
    length: 2
  })
  principalClassificationNumber: string

  @Column({
    length: 100
  })
  patentRight: string

  @Column({
    length: 100
  })
  inventor: string

  @Column({
    length: 300
  })
  digest: string

  @ManyToOne(() => User, (user) => user.patents, { eager: true })
  applyPatentUser: User

  @Column()
  patentState: IProductionState

  @Column()
  patentExist: IProductionExist

  @BeforeInsert()
  updateState() {
    this.patentState = -1
    this.patentExist = 1
  }

  @CreateDateColumn()
  createdTime: Date
}