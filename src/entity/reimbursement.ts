import { IReimbersementState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Reimbursement {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User, (user) => user.reimbursement_applys, { eager: true })
  applyUser: User

  @Column({
    length: 255
  })
  affairReason: string

  @Column({
    type: 'float'
  })
  amount: number

  @Column({
    type: 'text',
    nullable: true
  })
  invoice: string

  @Column({
    type: 'text',
    nullable: true
  })
  credential: string

  @Column()
  reimbursementState: IReimbersementState

  @BeforeInsert()
  updateState() {
    this.reimbursementState = -1
  }

  @CreateDateColumn()
  createdTime: Date
}