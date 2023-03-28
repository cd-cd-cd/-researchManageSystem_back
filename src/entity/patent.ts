import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patent {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({
    length: 25
  })
  name: string

  @Column({
    length: 12
  })
  applicationNumber: string

  @Column()
  applicationDate: Date

  @Column({
    length: 10
  })
  publicationNumber: string

  @Column()
  openDay: Date

  @Column({
    length: 2
  })
  principalClassificationNumber: string

  @Column({
    length: 20
  })
  patentRight: string

  @Column({
    length: 20
  })
  inventor: string

  @Column({
    length: 300
  })
  digest: string

  @CreateDateColumn()
  createdTime: Date
}