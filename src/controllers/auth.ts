import { Context } from 'koa'
import { User } from '../entity/user'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UnauthorizedException } from '../exceptions'
export default class AuthController {
  // 登录
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User)
    const { username, password } = ctx.request.body
    const user = await userRepository
    .createQueryBuilder()
    .where({ username: username })
    .addSelect('User.password')
    .getOne()

    if (!user) {
      throw new UnauthorizedException('用户名不存在')
    } else if (bcrypt.compareSync(password, user.password)) {
      ctx.status = 200
      ctx.body = { token: jwt.sign({ id: user.id }, process.env.JWT_SECRET as string) }
    } else {
      throw new UnauthorizedException('密码错误')
    }
  }

  // 老师创建学生
  public static async createStu(ctx: Context) {
    const userRepository = getManager().getRepository(User)

    const newUser = new User()
    const { username, name } = ctx.request.body
    newUser.role = 0
    newUser.username = username
    newUser.name = name
    console.log(username.slice(-6))
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await userRepository.findOne({ username: username})
    if (!isExit) {
      const user = await userRepository.save(newUser)
      ctx.status = 200
      ctx.body = user
    } else {
      ctx.status = 200
      ctx.body = '此学号学生已存在'
    }
  }
} 