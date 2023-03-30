import { ICopyRightExist, ICopyRightState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class CopyRight {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 20
  })
  registerNumber: string

  @Column({
    length: 15
  })
  name: string

  @Column({
    length: 5
  })
  category: string

  @Column({
    length: 20
  })
  copyrightOwner: string

  @Column()
  creationCompletionDate: Date

  @Column({
    nullable: true
  })
  firstPublicationDate: Date

  @Column()
  recordDate: Date

  @ManyToOne(() => User, (user) => user.copyRight, { eager: true })
  applyCopyRightUser: User

  @Column()
  copyRightState: ICopyRightState

  @Column()
  copyRightExist: ICopyRightExist

  @BeforeInsert()
  updateState() {
    this.copyRightState = -1
    this.copyRightExist = 1
  }

  @CreateDateColumn()
  createdTime: Date
}