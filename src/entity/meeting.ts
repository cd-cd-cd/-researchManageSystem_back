import { IMeetState } from "../libs/model"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MeetingRecord } from "./meeting_record";
import { User } from "./user";

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 20
  })
  title: string

  @ManyToOne(() => User, (user) => user.meetingSponsor, { eager: true })
  sponsor: User

  @Column({
    length: 50
  })
  address: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({
    length: 100,
    nullable: true
  })
  briefContent: string

  @Column()
  meetState: IMeetState

  @Column({
    nullable: true,
    type: "text"
  })
  materials: string

  @CreateDateColumn()
  createdTime: Date

  @OneToMany(() => MeetingRecord, (record) => record.meeting)
  records: MeetingRecord[]
}