import { Context } from 'koa'
import { NotFoundException, UnauthorizedException } from '../exceptions'
import { getManager } from 'typeorm'
import { Student } from '../entity/student'
import { Manager } from '../entity/manager'
import { Teacher } from '../entity/teacher'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default class UserController {
  // 获得个人信息
  public static async showUserDetail(ctx: Context) {
    const { id, role } = ctx.query
    let repository, user
    switch (+role) {
      case 0:
        repository = getManager().getRepository(Student)
        user = await repository.findOne({ id })
        break
      case 1:
        repository = getManager().getRepository(Teacher)
        user = await repository.findOne({ id })
        break
      case 2:
        repository = getManager().getRepository(Manager)
        user = await repository.findOne({ id })
        break
    }
    if (user) {
      ctx.status = 200
      ctx.body = user
    } else {
      throw new NotFoundException()
    }
  }

  // 创建管理员
  public static async createManager(ctx: Context) {
    const { username, name } = ctx.request.body
    const repository = getManager().getRepository(Manager)
    const newUser = new Manager()
    newUser.username = username
    newUser.name = name
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await repository.findOne({ username })
    if (!isExit) {
      const user = await repository.save(newUser)
      ctx.status = 200
      ctx.body = user
    } else {
      ctx.status = 200
      ctx.body = '此学号老师已存在'
    }
  }

  // 登录
  public static async login(ctx: Context) {
    const { username, password, role } = ctx.request.body
    let repository
    let user
    switch (role) {
      case 0:
        repository = getManager().getRepository(Student)
        user = await repository
          .createQueryBuilder()
          .where('Student.username = :username', { username })
          .addSelect('Student.password')
          .getOne()
        break
      case 1:
        repository = getManager().getRepository(Teacher)
        user = await repository
          .createQueryBuilder()
          .where('Teacher.username = :username', { username })
          .addSelect('Teacher.password')
          .getOne()
        break
      case 2:
        repository = getManager().getRepository(Manager)
        user = await repository
          .createQueryBuilder()
          .where('Manager.username = :username', { username })
          .addSelect('Manager.password')
          .getOne()
        break
    }
    if (!user) {
      throw new UnauthorizedException('用户名不存在')
    } else if (bcrypt.compareSync(password, user.password)) {
      ctx.status = 200
      ctx.body = {
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET as string),
        id: user.id
      }
    } else {
      throw new UnauthorizedException('密码错误')
    }
  }
}