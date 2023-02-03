import { typeIApplyState } from '../libs/model'
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Student } from './student'
import { Teacher } from './teacher'
import { Equipment } from './equipment'

@Entity()
export class DeviceApply {
  @PrimaryGeneratedColumn("uuid")
  id: number

  // @Column({
  //   length: 50
  // })
  // serialNumber: string
  @Column()
  equipmentId: string

  @Column()
  applyState: typeIApplyState

  @Column()
  deviceApply_start_Time: Date

  @Column()
  deviceApply_end_Time: Date

  @Column({
    length: 255,
    nullable: true
  })
  apply_reason: string

  // // 处理人(老师)
  // @Column()
  // teacherId: string

  @Column({
    nullable: true
  })
  refuseReason: string

  @CreateDateColumn()
  createdTime: Date

  @ManyToOne((type) => Student, (student) => student.deviceApplys, { eager: true })
  student: Student

  @ManyToOne((type) => Teacher, (teacher) => teacher.deviceApplys, { eager: true })
  teacher: Teacher
}