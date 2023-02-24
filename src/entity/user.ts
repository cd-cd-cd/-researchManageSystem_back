import { report } from "process"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToMany } from "typeorm"
import { Meeting } from "./meeting"
import { MeetingRecord } from "./meeting_record"
import { Report } from "./report"
import { ReportComment } from "./report_comment"

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

  @OneToMany(() => ReportComment, (comment) => comment.comment_user)
  reportComments: ReportComment[]

  @OneToMany(() => ReportComment, (comment) => comment.comment_reply_user)
  reportReplyComments: ReportComment[]

  @OneToMany(() => Report, (report) => report.report_submitter)
  submit_reports: Report[]

  @OneToMany(() => Report, (report) => report.report_reviewer)
  review_reports: Report[]
}