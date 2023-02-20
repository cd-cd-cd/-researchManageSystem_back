import { Context } from "koa";

export default class StuReportController {
  // 上传
  public static async uploadReport(ctx: Context) {
    const { id } = ctx.state.user
    const { startTime, endTime, text} = ctx.request.body
  }
}