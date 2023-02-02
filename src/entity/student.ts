import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { DeviceApply } from "./device_apply"
import { Teacher } from "./teacher"

@Entity()
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 20,
  })
  username: string

  @Column({
    length: 20,
  })
  name: string

  @Column({ select: false })
  password: string

  @Column({
    length: 20,
    nullable: true
  })
  phoneNumber: string

  @Column({
    length: 50,
    nullable: true
  })
  email: string

  @Column({
    nullable: true
  })
  resume: string

  @Column({
    nullable: true
  })
  avatar: string

  @CreateDateColumn()
  createdTime: Date

  @ManyToOne((type) => Teacher, (teacher) => teacher.students, { eager: true })
  @JoinColumn({name: 'teacherId'})
  teacher: Teacher

  @OneToMany((type) => DeviceApply, (deviceApply) => deviceApply.student)
  deviceApplys: DeviceApply[]
}