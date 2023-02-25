import { Context } from "koa";
import { Student } from "../../entity/student";
import { getManager } from "typeorm";
import { User } from "../../entity/user";
import { Report } from "../../entity/report";
import { ReportComment } from "../../entity/report_comment";
import { ReportSecondComment } from "../../entity/report_second_comment";

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

  // 回复评论
  public static async replyComment(ctx: Context) {
    const { id: userId } = ctx.state.user
    const { firstCommentId, replyUserId, comment } = ctx.request.body
    const comment_user = await getManager().getRepository(User).findOne({ trueId: userId })
    const comment_reply_user = await getManager().getRepository(User).findOne({ trueId: replyUserId })
    const first_comment = await getManager().getRepository(ReportComment).findOne({ id: firstCommentId })
    if (comment_user && comment_reply_user && first_comment) {
      const secondObj = new ReportSecondComment()
      secondObj.first_comment = first_comment
      secondObj.comment_user = comment_user
      secondObj.comment_reply_user = comment_reply_user
      secondObj.secondComment = comment
      await getManager().getRepository(ReportSecondComment).save(secondObj)
      ctx.status = 200
      ctx.body = {
        success: true,
        data: '',
        msg: '回复成功'
      }
    }
  }

  // 得到二级评论
  public static async getSecondComments(ctx: Context) {
    const { firstCommentId } = ctx.query
    const firstComment = await getManager().getRepository(ReportComment)
    .findOne({ id: firstCommentId })
    const secondComments = await getManager().getRepository(ReportSecondComment)
    .createQueryBuilder('secondComment')
    .leftJoinAndSelect('secondComment.comment_user', 'comment_user')
    .leftJoinAndSelect('secondComment.comment_reply_user', 'comment_reply_user')
    .where({ first_comment: firstComment })
    .getMany()

    ctx.status = 200
    ctx.body = {
      success: true,
      data: secondComments,
      msg: ''
    }
  }
}