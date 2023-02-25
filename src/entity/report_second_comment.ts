import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportComment } from "./report_comment";
import { User } from "./user";

@Entity()
export class ReportSecondComment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => ReportComment, (comment) => comment.secondComments, { eager: true })
  first_comment: ReportComment

  @ManyToOne(() => User, (user) => user.secondReportComment, { eager: true })
  comment_user: User

  @ManyToOne(() => User, (user) => user.secondReportReplyComment, { eager: true })
  comment_reply_user: User

  @Column({
    type: 'text'
  })
  secondComment: string

  @CreateDateColumn()
  createdTime: Date
}