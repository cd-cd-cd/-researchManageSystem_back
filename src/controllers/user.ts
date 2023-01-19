import { Context } from 'koa'
import { getManager } from 'typeorm'
import { User } from '../entity/user'

export default class UserController {
  // 获得个人信息
  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User)
    const user = await userRepository.findOne(+ctx.body.username)
    if(user) {
      ctx.status = 200
      ctx.body = user
    } else {
      ctx.status = 404
    }
  }
}