import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  role: 0 | 1 | 2

  @Column()
  username: string

  @Column()
  name: string

  @Column({ select: false })
  password: string
}