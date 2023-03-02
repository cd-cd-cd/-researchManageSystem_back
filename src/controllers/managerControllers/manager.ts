import { Context } from 'koa'
import { Teacher } from '../../entity/teacher'
import { getManager } from 'typeorm'
import bcrypt from 'bcryptjs'
import { User } from '../../entity/user'
import { Student } from '../../entity/student'

export default class ManagerController {
  // 管理员创建老师
  public static async createTeacher (ctx: Context) {
    const repository = getManager().getRepository(Teacher)
    const newUser = new Teacher()
    const { username, name } = ctx.request.body
    newUser.username = username
    newUser.name = name
    newUser.avatar = 'https://seach-chendian.oss-cn-hangzhou.aliyuncs.com/avatar/basic.png'
    const salt = bcrypt.genSaltSync(10)
    newUser.password = bcrypt.hashSync(username.slice(-6), salt)
    const isExit = await repository.findOne({ username: username })
    if (!isExit) {
      const teacher = await repository.save(newUser)
      const user = new User()
      user.trueId = teacher.id
      user.username = teacher.username
      user.name = teacher.name
      user.role = 1
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
      ctx.body = {
        status: 200,
        success: false,
        data: '',
        msg: '此学号老师已存在'
      }
    }
  }

  // 管理员创建学生
  public static async createStudent (ctx: Context) {
    const repository = getManager().getRepository(Student)
    const newUser = new Student()
    const { username, name, teacherId } = ctx.request.body
    const teacher = await getManager().getRepository(Teacher).findOne({ id: teacherId })
    newUser.username = username
    newUser.name = name
    newUser.avatar = 'https://seach-chendian.oss-cn-hangzhou.aliyuncs.com/avatar/basic.png'
    newUser.teacher = teacher!
    const salt = bcrypt.genSaltSync(10)
    newUser.password = bcrypt.hashSync(username.slice(-6), salt)
    const isExit = await repository.findOne({ username })
    if (!isExit) {
      const student = await repository.save(newUser)
      const user = new User()
      user.trueId = student.id
      user.username = student.username
      user.name = student.name
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
      ctx.body = ctx.body = {
        status: 200,
        success: false,
        data: '',
        msg: '此学号学生已存在'
      }
    }
  }

  // 获取老师信息
  public static async getTeacherInfos (ctx: Context) {
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const total = await getManager().getRepository(Teacher).count()
    const res = await getManager().getRepository(Teacher)
    .createQueryBuilder()
    .where({})
    .orderBy('createdTime', 'DESC')
    .skip(offset)
    .take(pageSize*1)
    .getMany()

    ctx.status = 200
    ctx.body = {
      success: 200,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        infos: res
      },
      msg: ''
    }
  }
  // 获取学生信息
  public static async getStudentInfos (ctx: Context) {
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const total = await getManager().getRepository(Student).count()
    const res = await getManager().getRepository(Student)
    .createQueryBuilder('student')
    .leftJoinAndSelect('student.teacher', 'teacher')
    .orderBy('student.createdTime', 'DESC')
    .where({})
    .skip(offset)
    .take(pageSize*1)
    .getMany()

    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        infos: res
      },
      msg: ''
    }
  }

  // 提供所有老师
  public static async getTeacher (ctx: Context) {
    const teachers = await getManager().getRepository(Teacher)
    .createQueryBuilder('teacher')
    .where({})
    .select(["teacher.id", "teacher.name"])
    .getMany()

    ctx.status = 200
    ctx.body = {
      success: true,
      data: teachers,
      msg: ''
    }
  }

  // 初始化学生密码
  public static async initStu (ctx: Context) {
    const { id, username } = ctx.request.body
    await getManager().getRepository(Student).update({ id }, { password: bcrypt.hashSync(username.slice(-6), bcrypt.genSaltSync(10))})
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: '密码初始化成功'
    }
  }

  // 初始化老师密码
  public static async initTeacher (ctx: Context) {
    const { id, username } = ctx.request.body
    await getManager().getRepository(Teacher).update({ id }, { password: bcrypt.hashSync(username.slice(-6), bcrypt.genSaltSync(10))})
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: '密码初始化成功'
    }
  }

  // 查询老师
  public static async searchTeacher (ctx: Context) {
    const { info } = ctx.query
    const teachers = await getManager().getRepository(Teacher)
    .find({
      where: [{ name: info }, { username: info }]
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: teachers,
      msg: ''
    }
  }

  // 查询学生
  public static async searchStudent (ctx: Context) {
    const { info } = ctx.query
    const students = await getManager().getRepository(Student)
    .find({
      where: [{ name: info }, { username: info }]
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: students,
      msg: ''
    }
  }
}