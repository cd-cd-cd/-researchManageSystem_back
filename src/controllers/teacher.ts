import { Context } from 'koa'
import { User } from '../entity/user'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NotFoundException, UnauthorizedException } from '../exceptions'
import { Student } from '../entity/student'
import { Teacher } from '../entity/teacher'
import { phoneValidator, emailValidator, resumeValidator } from '../validators/info'
export default class TeacherController {

  // 老师创建学生
  public static async createStu(ctx: Context) {
    const userRepository = getManager().getRepository(Student)
    const newUser = new Student()
    const { username, name, teacherId, createTime } = ctx.request.body
    newUser.teacherId = teacherId
    newUser.createTime = createTime
    newUser.username = username
    newUser.name = name
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await userRepository.findOne({ username: username })
    if (!isExit) {
      const user = await userRepository.save(newUser)
      ctx.status = 200
      ctx.body = user
    } else {
      ctx.status = 200
      ctx.body = '此学号学生已存在'
    }
  }

  // 修改联系电话、邮箱、个人简介
  public static async updatePhone(ctx: Context) {
    phoneValidator(ctx)
    const { phoneNumber, id } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { phoneNumber })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = '修改成功'
    } else {
      ctx.status = 400
      ctx.body = '修改失败'
    }
  }

  public static async updateEmail(ctx: Context) {
    emailValidator(ctx)
    const { email, id } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { email })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = '修改成功'
    } else {
      ctx.status = 400
      ctx.body = '修改失败'
    }
  }

  public static async updateResume(ctx: Context) {
    resumeValidator(ctx)
    const { resume, id } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { resume })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = '修改成功'
    } else {
      ctx.status = 400
      ctx.body = '修改失败'
    }
  }
} 