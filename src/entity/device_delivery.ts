import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Equipment } from "./equipment";

@Entity()
export class DeviceDelivery {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @OneToOne(() => Equipment, (equipment) => equipment.deviceDelivery)
  @JoinColumn()
  equipment: Equipment

  @Column()
  deviceApply_start_Time: Date

  @Column()
  deviceApply_end_Time: Date

  @CreateDateColumn()
  createdTime: Date
}