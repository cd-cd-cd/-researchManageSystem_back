import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Report } from "./report"

@Entity()
export class ReportReply {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Report, (report) => report.report_reply)
  report: Report

  @CreateDateColumn()
  createdTime: Date
}
