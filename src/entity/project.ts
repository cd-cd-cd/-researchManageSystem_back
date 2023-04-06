import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user"
import { IProjectExist, IProjectState } from "../libs/model"
import { ProjectRecord } from "./projectRecord"

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 30
  })
  title: string

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  manager: User

  @ManyToOne(() => User, (user) => user.teacherProjects, { eager: true })
  teacherManager: User

  @Column()
  projectState: IProjectState

  @Column()
  projectExist: IProjectExist

  @BeforeInsert()
  updateState() {
    this.projectState = -1
    this.projectExist = 1
  }

  @Column({
    type: 'text',
    nullable: true
  })
  teammate: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @OneToMany(() => ProjectRecord, (record) => record.project)
  records: ProjectRecord[]

  @CreateDateColumn()
  createdTime: Date
}