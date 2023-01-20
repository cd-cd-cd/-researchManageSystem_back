import { Context } from 'koa'
import { Teacher } from '../entity/teacher'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'

export default class ManagerController {
  // 管理员创建老师
  public static async createTeacher (ctx: Context) {
    const repository = getManager().getRepository(Teacher)
    const newUser = new Teacher()
    const { username, name, createTime } = ctx.request.body
    newUser.username = username
    newUser.name = name
    newUser.createTime = createTime
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await repository.findOne({ username: username })
    if (!isExit) {
      const user = await repository.save(newUser)
      ctx.status = 200
      ctx.body = user
    } else {
      ctx.status = 200
      ctx.body = '此学号老师已存在'
    }
  }
}