import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { Report } from "../../entity/report";
import { ReportComment } from "../../entity/report_comment";

export default class teacherReportController {
  // 得到周报信息
  public static async getReportInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize, isReview } = ctx.query
    const offset = (pageNum - 1) * pageSize
    let total, temps
    if (isReview === 'true') {
      total = await getManager().getRepository(Report)
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.report_reviewer', 'report_reviewer')
        .where('report_reviewer.trueId = :id', { id })
        .andWhere({ reportState: -1 })
        .getCount()

      temps = await getManager().getRepository(Report)
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.report_reviewer', 'report_reviewer')
        .leftJoinAndSelect('report.report_submitter', 'report_submitter')
        .where('report_reviewer.trueId = :id', { id })
        .andWhere({ reportState: -1 })
        .select('report')
        .addSelect('report_submitter')
        .orderBy('report.createdTime', 'DESC')
        .skip(offset)
        .take(pageSize)
        .getMany()
    } else {
      total = await getManager().getRepository(Report)
        .createQueryBuilder('report')
        .leftJoinAndSelect('report.report_reviewer', 'report_reviewer')
        .where('report_reviewer.trueId = :id', { id })
        .getCount()

      temps = await getManager().getRepository(Report)
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
    }

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

  // 查看周报
  public static async checkReport(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Report).update({ id }, { reportState: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: ''
    }
  }

  // 评论周报
  public static async commentReport(ctx: Context) {
    const { id: teacherId } = ctx.state.user
    const { reportId, stuId, commentContent } = ctx.request.body
    const report = await getManager().getRepository(Report).findOne({ id: reportId })
    const comment_user = await getManager().getRepository(User).findOne({ trueId: teacherId })
    const comment_reply_user = await getManager().getRepository(User).findOne({ trueId: stuId })

    const newCommentObj = new ReportComment()
    if (report && comment_reply_user && comment_user) {
      newCommentObj.report = report
      newCommentObj.comment_user = comment_user
      newCommentObj.comment_reply_user = comment_reply_user
      newCommentObj.commentContent = commentContent
      const commentObj = await getManager().getRepository(ReportComment).save(newCommentObj)
      if (commentObj) {
        await getManager().getRepository(Report).update({ id: reportId }, { reportState: 1 })
        ctx.status = 200
        ctx.body = {
          success: true,
          data: '',
          msg: '评论成功'
        }
      }
    }
  }

  // 得到某个周报一级评论
  public static async getFirstReportComment(ctx: Context) {
    const { reportId } = ctx.query
    const report = await getManager().getRepository(Report).findOne({ id: reportId })
    const comments = await getManager().getRepository(ReportComment).find({
      where: { report },
      select: [ "commentContent", "createdTime", "id", "comment_user" ],
      order: {
        createdTime: 'DESC'
      }
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: comments,
      msg: ''
    }
  }
}