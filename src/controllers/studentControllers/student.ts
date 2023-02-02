import { Context } from 'koa'
import { passwordValidator, resumeValidator } from '../../validators/info'
import { emailValidator } from '../..//validators/info'
import { phoneValidator } from '../..//validators/info'
import bouncer from 'koa-bouncer'
import bcrypt from 'bcryptjs'
import { UnauthorizedException, ValidationException } from '../../exceptions'
import { getManager } from 'typeorm'
import { Student } from '../../entity/student'

export default class StudentController {
  // 学生修改个人信息
  public static async updatePersonalInfo(ctx: Context) {
    try {
      phoneValidator(ctx)
      emailValidator(ctx)
      resumeValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const { phoneNumber, email, resume } = ctx.request.body
    const repository = getManager().getRepository(Student)
    await repository.update({ id }, { phoneNumber, email, resume })
    ctx.status = 200
    ctx.body = {
      status: 20000,
      data: '',
      msg: '修改成功',
      success: true
    }
  }

  // 学生修改密码
  public static async changePassword(ctx: Context) {
    try {
      passwordValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const { oldPassword, newPassword } = ctx.request.body
    const repository = getManager().getRepository(Student)
    const user = await repository
      .createQueryBuilder()
      .where({ id })
      .addSelect('Student.password')
      .getOne()
    if (!user) {
      throw new UnauthorizedException('用户名不存在')
    } else if (bcrypt.compareSync(oldPassword, user!.password)) {
      await repository.update({ id }, { password: bcrypt.hashSync(newPassword) })
      ctx.status = 200
      ctx.body = {
        status: 20001,
        data: '',
        msg: '密码修改成功',
        success: true
      }
    } else {
      throw new UnauthorizedException('原密码错误')
    }
  }
}