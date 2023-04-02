// import { IThesisExist, IThesisState } from "../libs/model";
import { IProductionExist, IProductionState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Thesis {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 30
  })
  title: string

  @Column({
    length: 20
  })
  firstAuthor: string

  @Column()
  publishDate: Date

  @Column({
    length: 5
  })
  publicationName: string

  @Column({
    length: 20
  })
  signature: string

  @Column({
    length: 5
  })
  discipline_one: string

  @ManyToOne(() => User, (user) => user.thesis, { eager: true })
  applyThesisUser: User

  @Column()
  thesisState: IProductionState

  @Column()
  thesisExist: IProductionExist

  @BeforeInsert()
  updateState() {
    this.thesisState = -1
    this.thesisExist = 1
  }

  @CreateDateColumn()
  createdTime: Date
}