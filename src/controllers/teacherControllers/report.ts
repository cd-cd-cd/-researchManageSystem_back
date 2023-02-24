import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { Report } from "../../entity/report";

export default class teacherReportController {
  // 得到周报信息
  public static async getReportInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const total = await getManager().getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.report_reviewer', 'report_reviewer')
    .where('report_reviewer.trueId = :id', { id })
    .getCount()

    const temps = await getManager().getRepository(Report)
    .createQueryBuilder('report')
    .leftJoinAndSelect('report.report_reviewer', 'report_reviewer')
    .leftJoinAndSelect('report.report_submitter', 'report_submitter')
    .where('report_reviewer.trueId = :id', { id })
    .select('report')
    .addSelect('report_submitter')
    .orderBy('report.createdTime', 'DESC')
    .skip(offset)
    .take(pageSize)
    .getMany()

    const reports = temps.map(report => {
      report.text = JSON.parse(report.text)
      return report
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        reports
      },
      msg: ''
    }
  }
}