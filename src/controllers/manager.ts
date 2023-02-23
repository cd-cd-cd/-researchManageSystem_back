import { Context } from 'koa'
import { Teacher } from '../entity/teacher'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '../entity/user'

export default class ManagerController {
  // 管理员创建老师
  public static async createTeacher (ctx: Context) {
    const repository = getManager().getRepository(Teacher)
    const newUser = new Teacher()
    const { username, name } = ctx.request.body
    newUser.username = username
    newUser.name = name
    newUser.avatar = 'https://pic4.zhimg.com/80/v2-4f8cf572d51e43d9b9f27f2f51f51921_xl.jpg'
    const salt = bcrypt.genSaltSync(10)
    newUser.password = bcrypt.hashSync(username.slice(-6), salt)
    const isExit = await repository.findOne({ username: username })
    if (!isExit) {
      const teacher = await repository.save(newUser)
      const user = new User()
      user.trueId = teacher.id
      user.username = teacher.username
      user.name = teacher.name
      user.role = 0
      await getManager().getRepository(User).save(user)
      ctx.status = 200
      ctx.body = {
        status: 200,
        success: true,
        data: '',
        msg: '创建成功'
      }
    } else {
      ctx.status = 200
      ctx.body = '此学号老师已存在'
    }
  }
}