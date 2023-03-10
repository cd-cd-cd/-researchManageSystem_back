import { IEquipmentState } from "../libs/model"
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Teacher } from "./teacher"
import { DeviceApply } from "./device_apply"
import { DeviceEntry } from "./device_entry"
import { DeviceDelivery } from "./device_delivery"

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    length: 50
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

  @OneToOne(() => DeviceEntry, (deviceEntry) => deviceEntry.equipment)
  deviceEntry: DeviceEntry

  @OneToOne(() => DeviceDelivery, (deviceDelivery) => deviceDelivery.equipment)
  deviceDelivery: DeviceDelivery
}