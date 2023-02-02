import { IEquipmentState } from "../libs/model"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Teacher } from "./teacher"

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 50,
    unique: true
  })
  serialNumber: string

  @Column({
    length: 50
  })
  name: string

  @Column({
    length: 50
  })
  version: string

  @Column({
    length: 50
  })
  originalValue: string

  @Column({
    length: 255,
    nullable: true
  })
  performanceIndex: string

  @Column({
    nullable: true,
    length: 50
  })
  address: string

  @Column({
    nullable: true
  })
  state: IEquipmentState

  @Column()
  warehouseEntryTime: string

  @Column({
    nullable: true
  })
  recipient: string

  @Column({
    nullable: true,
    length: 255
  })
  HostRemarks: string

  @Column({
    nullable: true,
    length: 255
  })
  remark: string

  @CreateDateColumn()
  createdTime: Date

  @ManyToOne((type) => Teacher, (teacher) => teacher.equipments, { eager: true })
  teacher: Teacher
}