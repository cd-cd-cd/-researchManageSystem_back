import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "./report";
import { ReportSecondComment } from "./report_second_comment";
import { User } from "./user";

@Entity()
export class ReportComment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Report, (report) => report.reportComments, { eager: true })
  report: Report

  @ManyToOne(() => User, (user) => user.reportComments, { eager: true })
  comment_user: User

  @ManyToOne(() => User, (user) => user.reportReplyComments, { eager: true })
  comment_reply_user: User

  @Column({
    type: 'text'
  })
  commentContent: string

  @OneToMany(() => ReportSecondComment, (secondComment) => secondComment.first_comment)
  secondComments: ReportSecondComment[]

  @CreateDateColumn()
  createdTime: Date
}