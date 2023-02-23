import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meeting } from "./meeting";
import { User } from "./user";

@Entity()
export class MeetingRecord {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Meeting, (meeting) => meeting.records, { eager: true })
  meeting: Meeting

  @ManyToOne(() => User, (user) => user.meetingRecordSponsor, { eager: true })
  sponsor: User

  @ManyToOne(() => User, (user) => user.meetingRecordParticipant, { eager: true })
  participant: User

  @CreateDateColumn()
  createdTime: Date
}