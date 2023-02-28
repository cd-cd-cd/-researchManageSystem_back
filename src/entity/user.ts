import { report } from "process"
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToMany } from "typeorm"
import { LeaveRequest } from "./leaveRequest"
import { LeaveRequestCheck } from "./leaveRequest_check"
import { Meeting } from "./meeting"
import { MeetingRecord } from "./meeting_record"
import { Reimbursement } from "./reimbursement"
import { Report } from "./report"
import { ReportComment } from "./report_comment"
import { ReportSecondComment } from "./report_second_comment"

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

  @OneToMany(() => ReportSecondComment, (secondComment) => secondComment.comment_user)
  secondReportComment: ReportSecondComment[]

  @OneToMany(() => ReportSecondComment, (secondComment) => secondComment.comment_reply_user)
  secondReportReplyComment: ReportSecondComment[]

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.askForLeavePerson)
  leaveRequests: LeaveRequest[]

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.auditor)
  checkRequests: LeaveRequest[]

  @OneToMany(() => LeaveRequestCheck, (check) => check.checker)
  leaveRequestChecks: LeaveRequestCheck[] 

  @OneToMany(() => Reimbursement, (reimbursement) => reimbursement.applyUser)
  reimbursement_applys: Reimbursement[]
}