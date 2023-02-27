import { IRequestState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { LeaveRequestCheck } from "./leaveRequest_check";

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({
    nullable: true
  })
  endStartTime: Date

  @Column({
    nullable: true
  })
  endEndTime: Date

  @Column({
    length: 255
  })
  reason: string

  @Column({
    nullable: true,
    type: "text"
  })
  materials: string

  @ManyToOne(() => User, (user) => user.leaveRequests, { eager: true })
  askForLeavePerson: User

  @ManyToOne(() => User, (user) => user.checkRequests, { eager: true })
  auditor: User

  @Column()
  requestState: IRequestState

  @BeforeInsert()
  updateState() {
    this.requestState = -1
    this.isUpdate = false
  }

  @Column()
  isUpdate: boolean

  @OneToOne(() => LeaveRequestCheck, (leaveRequestCheck) => leaveRequestCheck.request)
  checkTable: LeaveRequestCheck

  @CreateDateColumn()
  createdTime: Date
}