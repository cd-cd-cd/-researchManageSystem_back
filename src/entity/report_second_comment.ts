import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportComment } from "./report_comment";

@Entity()
export class ReportSecondComment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => ReportComment, (comment) => comment.secondComments, { eager: true })
  first_comment: ReportComment

  @Column({
    type: 'text'
  })
  secondComment: string

  @CreateDateColumn()
  createdTime: Date
}