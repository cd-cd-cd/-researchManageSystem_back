import { Context } from "koa"
import { Teacher } from "../../entity/teacher"
import co from 'co'
import fs from 'fs'
import path from 'path'
import { Student } from "../../entity/student"
import { getManager } from "typeorm"
import { bucket, client, endPoint } from "../../utils/oss"
import dayjs from "dayjs"
import { removeFileDir } from "../../utils/fileFunc"
import { File } from "koa-multer"
export default class MeetingController {
  // 提供参会人人选
  public static async getParticipants(ctx: Context) {
    const { id, role } = ctx.state.user
    if (role === 0) {
      const studentRepository = getManager().getRepository(Student)
      const teacher = await studentRepository.findOne({ id })
      if (teacher) {
        console.log(teacher)
        const students = await studentRepository.createQueryBuilder('student')
          .where('student.teacher = :teacherId', { teacherId: teacher.teacher.id })
          .select(['student.id as id', 'student.name as name'])
          .getRawMany()

        const arr = students.filter(item => item.id !== id).map(item => {
          return { ...item, role: 0 }
        })
        const res = [
          { id: teacher.teacher.id, name: teacher.teacher.name, role: 1 }, ...arr
        ]
        ctx.status = 200
        ctx.body = {
          success: true,
          status: 200,
          msg: '',
          data: res
        }
      }
    }
  }
  // 创建会议
  public static async createMeet(ctx: Context) {
    const { id } = ctx.state.user
    const { num } = ctx.query
    const files = ctx.request.files as any

    if (+num === 1) {
      const url = put(files.file)
      if (url) {
        console.log(url)
      }
    } else if (+num > 1) {
      const urls = []
      for (let file of files.file) {
        const url = put(file)
        if (url) {
          urls.push(url)
        } else {
          throw new Error('有文件上传异常')
        }
      }
    }
    ctx.status = 200
    ctx.body = {
      data: num
    }

    async function put(file: any) {
      const fileName = dayjs() + file.name
      const filePath = path.join(__dirname, '../../', `/public/uploads/${file.name}`)
      const result = await client.put('/meetings/' + fileName, filePath)
      const { url, res: { status } } = result
      if (status === 200) {
        return url
      } else {
        return undefined
      }
    }}
  }