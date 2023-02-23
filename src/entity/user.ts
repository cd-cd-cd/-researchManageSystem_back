import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToMany } from "typeorm"
import { Meeting } from "./meeting"
import { MeetingRecord } from "./meeting_record"

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  trueId: string

  @Column()
  role: 0 | 1 | 2

  @Column({
    length: 20,
  })
  username: string

  @Column({
    length: 20,
  })
  name: string

  @OneToMany(() => MeetingRecord, (record) => record.sponsor)
  meetingRecordSponsor: MeetingRecord[]

  @OneToMany(() => MeetingRecord, (record) => record.participant)
  meetingRecordParticipant: MeetingRecord[]

  @OneToMany(() => Meeting, (meeting) => meeting.sponsor)
  meetingSponsor: Meeting[]
}