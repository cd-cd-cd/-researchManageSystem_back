import { Context } from "koa"
import { Student } from "../../entity/student"
import { getManager } from "typeorm"
import { client } from "../../utils/oss"
import dayjs from "dayjs"
import path from 'path'
import { put, removeFileDir } from "../../utils/fileFunc"
import { MeetingValidator } from "../../validators/commonValidators/createMeeting"
import { NotFoundException, ValidationException } from "../../exceptions"
import bouncer from 'koa-bouncer'
import { Meeting } from "../../entity/meeting"
export default class MeetingController {
  // 提供参会人人选
  public static async getParticipants(ctx: Context) {
    const { id, role } = ctx.state.user
    if (role === 0) {
      const studentRepository = getManager().getRepository(Student)
      const teacher = await studentRepository.findOne({ id })
      if (teacher) {
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
    try {
      MeetingValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const { title, briefContent, startTime, endTime, address, participants } = ctx.request.body
    const repository = getManager().getRepository(Meeting)
    const newObj = new Meeting()
    newObj.title = title
    newObj.sponsor = id
    newObj.participants = JSON.stringify(participants)
    newObj.address = address
    newObj.startTime = startTime
    newObj.endTime = endTime
    newObj.briefContent = briefContent
    newObj.meetState = 1
    const obj = await repository.save(newObj)
    if (obj) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: '',
        data: obj.id,
        status: 200
      }
    } else {
      throw new NotFoundException('未成功')
    }
  }

  // 创建会议（上传资料）
  public static async postMaterial(ctx: Context) {
    const { num, id } = ctx.query
    const files = ctx.request.files as any
    const repository = getManager().getRepository(Meeting)
    const updateMatetial = async (id: string, url: string | (string | undefined)[]) => {
      console.log(url)
      await repository.update({ id }, { materials: JSON.stringify(url) })
    }
    if (+num === 1) {
      const url = await put(files.file, '/meetings/')
      if (url) {
        removeFileDir(path.join(__dirname, '../../public/uploads'))
        updateMatetial(id, [url])
        ctx.status = 200
        ctx.body = {
          success: true,
          status: 200,
          msg: '创建成功',
          data: ''
        }
      }
    } else if (+num > 1) {
      const urlsPromise = []
      for (let file of files.file) {
        const urlPromise = put(file, '/meetings/')
        urlsPromise.push(urlPromise)
      }
      Promise.all(urlsPromise).then(values => {
        removeFileDir(path.join(__dirname, '../../public/uploads'))
        const urls = values
        updateMatetial(id, urls)
      })
      ctx.status = 200
      ctx.body = {
        success: true,
        status: 200,
        msg: '创建成功',
        data: ''
      }
    }
  }
}