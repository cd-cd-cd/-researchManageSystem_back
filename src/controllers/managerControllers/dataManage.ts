import { Context } from "koa";
import { Student } from "../../entity/student";
import { getManager } from "typeorm";
import { Teacher } from "../../entity/teacher";
import { studentReportPart, studentMeetingPart, studentReimbursementPart, studentRequetPart, teacherDevicePart, teacherMeetingPart, teacherReimbursementPart } from "../../utils/handleExcel";

export default class DataManageController {
  // 得到学生和老师
  public static async getList(ctx: Context) {
    const { role } = ctx.query
    let info
    if (role === '0') {
      info = await getManager().getRepository(Student)
        .find({
          select: ['id', 'name', 'username']
        })
    } else if (role === '1') {
      info = await getManager().getRepository(Teacher)
        .find({
          select: ['id', 'name', 'username']
        })
    }
    ctx.status = 200
    ctx.body = {
      success: true,
      data: info,
      msg: ''
    }
  }

  // 输出excel
  public static async exportExcel(ctx: Context) {
    const { role, module, id, startTime, endTime } = ctx.request.body
    let buffer
    if (role === 1) {
      if (module === 'device') {
        buffer = await teacherDevicePart(id, startTime, endTime)
      } else if (module === 'meeting') {
        buffer = await teacherMeetingPart(id, startTime, endTime)
      } else if (module === 'reimbursement') {
        buffer = await teacherReimbursementPart(id, startTime, endTime)
      }
    } else if (role === 0) {
      if (module === 'report') {
        buffer = await studentReportPart(id, startTime, endTime)
      } else if (module === 'meeting') {
        buffer = await studentMeetingPart(id, startTime, endTime)
      } else if (module === 'reimbursement') {
        buffer = await studentReimbursementPart(id, startTime, endTime)
      } else if (module === 'request') {
        buffer = await studentRequetPart(id, startTime, endTime)
      }
    }
    // 设置content-type请求头
    ctx.set('Content-Type', 'application/vnd.openxmlformats')
    ctx.status = 200
    ctx.body = {
      success: true,
      data: buffer
    }
  }
}