import { Context } from 'koa'
import { resumeValidator } from '../../validators/info'
import { emailValidator } from '../..//validators/info'
import { phoneValidator } from '../..//validators/info'
import bouncer from 'koa-bouncer'
import { ValidationException } from '../../exceptions'
import { getManager } from 'typeorm'
import { Student } from '../../entity/student'

export default class StudentController {
  // 学生修改个人信息
  public static async updatePersonalInfo (ctx: Context) {
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
}