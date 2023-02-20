import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReportReply } from "./report_reply";
import { Student } from "./student";

@Entity()
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() =>Student, (student) => student.reports, { eager: true })
  student: Student

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column()
  text: string

  @OneToMany(() => ReportReply, (report_reply) => report_reply.report)
  report_reply: ReportReply[]

  @CreateDateColumn()
  createdTime: Date
}