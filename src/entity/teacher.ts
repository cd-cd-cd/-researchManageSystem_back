import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn("uuid")
  id: string

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

  @Column()
  avatar: string

  @CreateDateColumn()
  createdTime: Date;
}