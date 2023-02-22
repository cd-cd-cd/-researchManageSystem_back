import { IMeetState } from "../libs/model"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 20
  })
  title: string

  @Column()
  sponsor: string

  @Column()
  participants: string

  @Column({
    length: 50
  })
  address: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({
    length: 100,
    nullable: true
  })
  briefContent: string

  @Column()
  meetState: IMeetState

  @Column({
    nullable: true,
    type: "text"
  })
  materials: string

  @CreateDateColumn()
  createdTime: Date
}