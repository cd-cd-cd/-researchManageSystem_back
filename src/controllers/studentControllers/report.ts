import { Context } from "koa";
import { Student } from "../../entity/student";
import { getManager } from "typeorm";
import { User } from "../../entity/user";
import { Report } from "../../entity/report";

export default class StuReportController {
  // 上传
  public static async uploadReport(ctx: Context) {
    const { id } = ctx.state.user
    const { startTime, endTime, text } = ctx.request.body
    const student = await getManager().getRepository(Student)
      .findOne({ id })
    const report_submitter = await getManager().getRepository(User)
      .findOne({ trueId: id })
    const report_reviewer = await getManager().getRepository(User)
      .findOne({ trueId: student?.teacher.id })

    if (report_submitter && report_reviewer) {
      const obj = new Report()
      obj.startTime = startTime
      obj.endTime = endTime
      obj.text = text
      obj.report_reviewer = report_reviewer
      obj.report_submitter = report_submitter
      const res = await getManager().getRepository(Report).save(obj)
      if (res) {
        ctx.status = 200
        ctx.body = {
          msg: '上传成功',
          data: '',
          success: true
        }
      }
    }
  }

  // 得到周报记录
  public static async getReportRecord(ctx: Context) {
    const { id } = ctx.state.user

    const temps = await getManager().getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.report_submitter', 'report_submitter')
    .where('report_submitter.trueId = :id', { id })
    .select('report')
    .orderBy('report.createdTime', 'DESC')
    .getMany()
    
    const reports = temps.map((report) => {
      report.text = JSON.parse(report.text)
      return report
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: reports,
      msg: ''
    }
  }
}