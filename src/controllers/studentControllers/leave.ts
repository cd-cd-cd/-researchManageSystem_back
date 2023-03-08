import { Context } from "koa";
import bouncer from 'koa-bouncer'
import path from 'path'
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { LeaveRequest } from "../../entity/leaveRequest";
import { NotFoundException, ValidationException } from "../../exceptions";
import { leaveValidator } from "../../validators/studentValidators/leave";
import { Student } from "../../entity/student";
import { put, removeFileDir } from "../../utils/fileFunc";

export default class StuLeaveController {
  // 请假申请
  public static async postLeaveRequest(ctx: Context) {
    const { id } = ctx.state.user
    const { startTime, endTime, reason } = ctx.request.body
    try {
      leaveValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const student = await getManager().getRepository(Student).findOne({ id })
    const askForLeavePerson = await getManager().getRepository(User).findOne({ trueId: id })
    const auditor = await getManager().getRepository(User).findOne({ trueId: student?.teacher.id })
    if (askForLeavePerson && auditor) {
      const leaveRequestObj = new LeaveRequest()
      leaveRequestObj.startTime = startTime
      leaveRequestObj.endTime = endTime
      leaveRequestObj.reason = reason
      leaveRequestObj.askForLeavePerson = askForLeavePerson
      leaveRequestObj.auditor = auditor
      leaveRequestObj.endStartTime = startTime
      leaveRequestObj.endEndTime = endTime
      const res = await getManager().getRepository(LeaveRequest).save(leaveRequestObj)
      if (res) {
        ctx.status = 200
        ctx.body = {
          msg: '申请已发送',
          data: res.id,
          success: true
        }
      } else {
        throw new NotFoundException('未成功')
      }
    }
  }

  // 请假申请（资料）
  public static async postLeaveMaterial(ctx: Context) {
    const { num, id } = ctx.query
    const files = ctx.request.files as any
    const repository = getManager().getRepository(LeaveRequest)
    const updateMatetial = async (id: string, url: string) => {
      await repository.update({ id }, { materials: url })
    }
    if (+num === 1) {
      const url = await put(files.file, '/leaveRequest/')
      if (url) {
        removeFileDir(path.join(__dirname, '../../public/uploads'))
        updateMatetial(id, url)
        ctx.status = 200
        ctx.body = {
          success: true,
          status: 200,
          msg: '申请已发送',
          data: ''
        }
      }
    } else if (+num > 1) {
      const urlsPromise = []
      for (let file of files.file) {
        const urlPromise = put(file, '/leaveRequest/')
        urlsPromise.push(urlPromise)
      }
      Promise.all(urlsPromise).then(values => {
        removeFileDir(path.join(__dirname, '../../public/uploads'))
        const urls = values
        updateMatetial(id, urls.join(';'))
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

  // 得到请假申请
  public static async getLeaveRequest(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const askForLeavePerson = await getManager().getRepository(User).findOne({ trueId: id })
    const total = await getManager().getRepository(LeaveRequest).count({ askForLeavePerson })
    const requests = await getManager().getRepository(LeaveRequest)
    .createQueryBuilder('leaveRequest')
    .where({ askForLeavePerson })
    .orderBy('createdTime', 'DESC')
    .offset(offset)
    .limit(pageSize * 1)
    .getMany()

    if (requests) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data: {
          pageNum: +pageNum,
          pageSize: +pageSize,
          total,
          requests
        },
        msg: ''
      }
    }
  }
}