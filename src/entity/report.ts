import { IReportState } from "../libs/model";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportComment } from "./report_comment";
import { User } from "./user";

@Entity()
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({
    type: 'text'
  })
  text: string

  @ManyToOne(() => User, (user) => user.submit_reports, { eager: true })
  report_submitter: User

  @ManyToOne(() => User, (user) => user.review_reports, { eager: true })
  report_reviewer: User

  @OneToMany(() => ReportComment, (comment) => comment.report)
  reportComments: ReportComment[]

  @Column()
  reportState: IReportState

  @BeforeInsert()
  updateState() {
    this.reportState = -1
  }

  @CreateDateColumn()
  createdTime: Date
}