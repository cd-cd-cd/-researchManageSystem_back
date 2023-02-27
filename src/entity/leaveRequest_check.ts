import { IRequestState } from "../libs/model";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeaveRequest } from "./leaveRequest";
import { User } from "./user";

@Entity()
export class LeaveRequestCheck {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToOne(() => LeaveRequest, (leaveRequest) => leaveRequest.checkTable)
  request: LeaveRequest

  @Column()
  requestState: IRequestState

  @ManyToOne(() => User, (user) => user.leaveRequestChecks, { eager: true })
  checker: User

  @CreateDateColumn()
  createdTime: Date
}