import { Context } from "koa";
import { Student } from "../../entity/student";
import { getManager } from "typeorm";
import { Teacher } from "../../entity/teacher";
import { studentMeetingPart, studentProductionPart, studentProjectPart, studentReimbursementPart, studentReportPart, studentRequetPart, teacherDevicePart, teacherMeetingPart, teacherReimbursementPart } from "../../utils/handleExcel";

export default class DataController {
  // 得到学生
  public static async getStudent(ctx: Context) {
    const { id } = ctx.state.user
    const teacher = await getManager().getRepository(Teacher).findOne({ id })
    const students = await getManager().getRepository(Student)
      .find({
        where: { teacher },
        select: ["id", "name", "username"]
      })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: students,
      msg: ''
    }
  }

  // 输出excel
  public static async exportExcel(ctx: Context) {
    const { id } = ctx.state.user
    const { role, module, studentId, startTime, endTime } = ctx.request.body
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
        buffer = await studentReportPart(studentId, startTime, endTime)
      } else if (module === 'meeting') {
        buffer = await studentMeetingPart(studentId, startTime, endTime)
      } else if (module === 'reimbursement') {
        buffer = await studentReimbursementPart(studentId, startTime, endTime)
      } else if (module === 'request') {
        buffer = await studentRequetPart(studentId, startTime, endTime)
      } else if (module === 'production') {
        buffer = await studentProductionPart(studentId, startTime, endTime)
      } else if (module === 'project') {
        buffer = await studentProjectPart(studentId, startTime, endTime)
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