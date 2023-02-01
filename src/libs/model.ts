type IRole = 0 | 1 | 2
// token的个人信息
interface IUser {
  id: string
  username: string
  name: string
  phoneNumber: string
  email?: string
  resume?: string
  avatar?: string
  createdTime?: Date
  role: IRole
}

// -1 -- 损坏 0 -- 闲置 1 -- 在用
type IEquipmentState = -1 | 0 | 1

export type {
  IRole,
  IUser,
  IEquipmentState
}