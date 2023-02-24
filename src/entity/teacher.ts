import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, OneToOne } from "typeorm"
import { DeviceApply } from "./device_apply"
import { Equipment } from "./equipment"
import { Report } from "./report"
import { Student } from "./student"
@Entity()
export class Teacher {
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

  @Column()
  avatar: string

  @CreateDateColumn()
  createdTime: Date

  @OneToMany((type) => Equipment, (equipment) => equipment.teacher)
  equipments: Equipment[]

  @OneToMany((type) => Student, (student) => student.teacher)
  students: Student[]

  @OneToMany((type) => DeviceApply, (apply) => apply.teacher)
  deviceApplys: DeviceApply[]
}