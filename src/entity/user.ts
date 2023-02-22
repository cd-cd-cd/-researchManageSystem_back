import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  role: 0 | 1 | 2

  @Column({
    length: 20,
  })
  username: string

  @CreateDateColumn()
  createdTime: Date;
}