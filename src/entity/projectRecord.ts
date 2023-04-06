import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project";

@Entity()
export class ProjectRecord {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Project, (project) => project.records, { eager: true })
  project: Project

  @Column({
    type: 'text'
  })
  researchProgress: string

  @Column({
    type: 'text'
  })
  nextPlan: string

  @Column({
    type: 'text'
  })
  fundPlan: string

  @Column({
    type: 'text'
  })
  clarification: string

  @CreateDateColumn()
  createdTime: Date
}