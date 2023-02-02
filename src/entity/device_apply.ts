import { typeIApplyState } from '../libs/model'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Student } from './student'

@Entity()
export class DeviceApply {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 50
  })
  serialNumber: string
  
  @Column()
  applyState: typeIApplyState

  @Column()
  deviceApply_start_Time: string

  @Column()
  deviceApply_end_Time: string

  @Column({
    length: 255,
    nullable: true
  })
  apply_reason: string

  // 处理人(老师)
  @Column()
  teacherId: string

  @CreateDateColumn()
  createdTime: Date

  @ManyToOne((type) => Student, (student) => student.deviceApplys)
  student: Student
}