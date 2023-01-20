import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Manager {
  @PrimaryGeneratedColumn("uuid")
  id: number

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
}