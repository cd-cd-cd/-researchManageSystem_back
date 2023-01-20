import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Teacher {
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

  @Column({
    length: 20,
    nullable: true
  })
  phoneNumber: string

  @Column({
    length: 50,
    nullable: true
  })
  email: string

  @Column({
    nullable: true
  })
  resume: string

  @Column({
    nullable: true
  })
  avatar: string

  @Column()
  createTime: string
}