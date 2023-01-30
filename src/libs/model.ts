export type IRole = 0 | 1 | 2
// token的个人信息
export interface IUser {
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