import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipment } from "./equipment";
import { Student } from "./student";

@Entity()
export class DeviceDelivery {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToOne(() => Equipment, (equipment) => equipment.deviceDelivery, { eager: true })
  @JoinColumn()
  equipment: Equipment

  @Column()
  deviceApply_start_Time: Date

  @Column()
  deviceApply_end_Time: Date

  @CreateDateColumn()
  createdTime: Date
}