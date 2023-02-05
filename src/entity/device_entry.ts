import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Equipment } from './equipment'

@Entity()
export class DeviceEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToOne(() => Equipment, (equipment) => equipment.deviceEntry, { eager: true })
  @JoinColumn()
  equipment: Equipment

  @CreateDateColumn()
  createdTime: Date
}