import { Context } from 'koa'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import { UnauthorizedException, ValidationException } from '../../exceptions'
import { Student } from '../../entity/student'
import { Teacher } from '../../entity/teacher'
import bouncer from 'koa-bouncer'
import { phoneValidator, emailValidator, resumeValidator, usernameValidator, nameValidator, passwordValidator } from '../../validators/info'
import { User } from '../../entity/user'
export default class TeacherController {

  // 老师创建学生
  public static async createStu(ctx: Context) {
    usernameValidator(ctx)
    nameValidator(ctx)
    const { id: teacher } = ctx.state.user
    const userRepository = getManager().getRepository(Student)
    const newUser = new Student()
    const { username, name } = ctx.request.body
    newUser.teacher = teacher
    newUser.username = username
    newUser.name = name
    newUser.avatar = 'https://seach-chendian.oss-cn-hangzhou.aliyuncs.com/avatar/basic.png'
    newUser.password = bcrypt.hashSync(username.slice(-6))
    const isExit = await userRepository.findOne({ username: username })
    if (!isExit) {
      const stu = await userRepository.save(newUser)
      const user = new User()
      user.trueId = stu.id
      user.username = stu.username
      user.name = stu.name
      user.role = 0
      await getManager().getRepository(User).save(user)
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
    const { id } = ctx.state.user
    const { phoneNumber } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { phoneNumber })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = {
        status: 10102,
        msg: '电话修改成功',
        data: '',
        success: true
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 10103,
        msg: '电话修改失败',
        data: '',
        success: false
      }
    }
  }

  public static async updateEmail(ctx: Context) {
    emailValidator(ctx)
    const { id } = ctx.state.user
    const { email } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { email })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = {
        status: 10104,
        msg: '邮箱修改成功',
        data: '',
        success: true
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 10105,
        msg: '邮箱修改失败',
        data: '',
        success: false
      }
    }
  }

  public static async updateResume(ctx: Context) {
    resumeValidator(ctx)
    const { id } = ctx.state.user
    const { resume } = ctx.request.body
    const repository = getManager().getRepository(Teacher)
    await repository.update({ id }, { resume })
    const user = await repository.findOne({ id })
    if (user) {
      ctx.status = 200
      ctx.body = {
        status: 10106,
        msg: '简介修改成功',
        data: '',
        success: true
      }
    } else {
      ctx.status = 400
      ctx.body = {
        status: 10107,
        msg: '简介修改失败',
        data: '',
        success: false
      }
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
    // const total = await repository.count({ teacherId: id })
    const total = await repository.count({ teacher: id })
    const students = await repository.createQueryBuilder()
      .where({ teacher: id })
      .orderBy('createdTime', 'DESC')
      .offset(offset)
      .limit(pageSize * 1)
      .getMany()
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

  // 老师修改密码
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
    const repository = getManager().getRepository(Teacher)
    const user = await repository
      .createQueryBuilder()
      .where({ id })
      .addSelect('Teacher.password')
      .getOne()
    if (!user) {
      throw new UnauthorizedException('用户名不存在')
    } else if (bcrypt.compareSync(oldPassword, user!.password)) {
      await repository.update({ id }, { password: bcrypt.hashSync(newPassword) })
      ctx.status = 200
      ctx.body = {
        status: 10108,
        data: '',
        msg: '密码修改成功',
        success: true
      }
    } else {
      throw new UnauthorizedException('原密码错误')
    }
  }
}
