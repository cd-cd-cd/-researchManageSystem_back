import { Context } from 'koa'
import { User } from '../entity/user'
import { getManager, Tree } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NotFoundException, UnauthorizedException } from '../exceptions'
import { Student } from '../entity/student'
import { Teacher } from '../entity/teacher'
import { phoneValidator, emailValidator, resumeValidator, usernameValidator, nameValidator } from '../validators/info'
export default class TeacherController {

  // 老师创建学生
  public static async createStu(ctx: Context) {
    usernameValidator(ctx)
    nameValidator(ctx)
    const { id: teacherId } = ctx.state.user
    console.log(teacherId, 'teacherid')
    const userRepository = getManager().getRepository(Student)
    const newUser = new Student()
    const { username, name } = ctx.request.body
    newUser.teacherId = teacherId
    newUser.username = username
    newUser.name = name
    newUser.avatar = 'https://pic4.zhimg.com/80/v2-4f8cf572d51e43d9b9f27f2f51f51921_xl.jpg'
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await userRepository.findOne({ username: username })
    if (!isExit) {
      const user = await userRepository.save(newUser)
      ctx.status = 200
      ctx.body = {
        status: 10004,
        data: '',
        msg: '创建成功',
        success: true
      }
    } else {
      ctx.status = 200
      ctx.body = {
        status: 10005,
        data: '',
        msg: '此学号学生已存在',
        success: false
      }
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
      ctx.body = '电话修改成功'
    } else {
      ctx.status = 400
      ctx.body = '电话修改失败'
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
      ctx.body = '邮箱修改成功'
    } else {
      ctx.status = 400
      ctx.body = '邮箱修改失败'
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
      ctx.body = '简介修改成功'
    } else {
      ctx.status = 400
      ctx.body = '简介修改失败'
    }
  }

  // 修改头像
  public static async updateAvatar(ctx: Context) {
    const { avatar, id } = ctx.request.body
    if (avatar && id) {
      const repository = getManager().getRepository(Teacher)
      await repository.update({ id }, { avatar })
      const user = await repository.findOne({ id })
      if (user) {
        ctx.status = 200
        ctx.body = '头像修改成功'
      } else {
        ctx.status = 400
        ctx.body = '头像修改失败'
      }
    }
  }

  // 老师获取学生信息
  public static async stuList(ctx: Context) {
    const { pageNum, pageSize } = ctx.query
    const { id } = ctx.state.user
    const offset = (pageNum - 1) * pageSize
    const repository = getManager().getRepository(Student)
    const total = await repository.count({ teacherId: id })
    const students = await repository.createQueryBuilder()
    .where({ teacherId: id })
    .orderBy('createdTime', 'DESC')
    .offset(offset)
    .limit(pageSize * 1)
    .getMany()
    console.log(students, 'students')
    ctx.status = 200
    ctx.body = {
      status: 10100,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        list: students
      },
      msg: '学生列表获取成功',
      success: true
    }
  }

  // 得到学生详细信息
  public static async stuDetail(ctx: Context) {
    const { id } = ctx.query
    const repository = getManager().getRepository(Student)
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = {
        status: 10011,
        data: user,
        msg: '学生信息获取成功',
        success: true
      }
    } else {
      ctx.status = 200
      ctx.body = {
        status: 10012,
        data: '',
        msg: '没有该学生信息',
        success: false
      }
    }
  }

  // 老师删除学生
  public static async deleteStu(ctx: Context) {
    const { id } = ctx.request.body
    const repository = getManager().getRepository(Student)
    await repository.delete({ id })
    ctx.status = 200
    ctx.body = {
      status: 10101,
      data: '',
      msg: '删除成功',
      success: true
    }
  }
} 