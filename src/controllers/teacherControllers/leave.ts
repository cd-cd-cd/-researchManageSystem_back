import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { LeaveRequest } from "../../entity/leaveRequest";
import { LeaveRequestCheck } from '../../entity/leaveRequest_check'


export default class TeacherLeaveController {
  public static async getRequestInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize, chooseUnchecked } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const auditor = await getManager().getRepository(User).findOne({ trueId: id })
    let requests, total
    if (chooseUnchecked === 'true') {
      [requests, total] = await getManager().getRepository(LeaveRequest).findAndCount({
        where: { auditor, requestState: -1 },
        order: { createdTime: 'DESC' },
        skip: offset,
        take: pageSize
      })
    } else {
      [requests, total] = await getManager().getRepository(LeaveRequest).findAndCount({
        where: { auditor },
        order: { createdTime: 'DESC' },
        skip: offset,
        take: pageSize
      })
    }
    ctx.status = 200
    ctx.body = {
      success: true,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        requests
      }
    }
  }

  // 拒绝
  public static async refuseRequest(ctx: Context) {
    const { id } = ctx.request.body
    const repository = getManager().getRepository(LeaveRequest)
    await repository.update({ id }, { requestState: 1 })
    const obj = new LeaveRequestCheck()
    const leaveRequest = await repository.findOne({ id })
    obj.requestState = 1
    obj.checker = (leaveRequest?.auditor)!
    await getManager().getRepository(LeaveRequestCheck).save(obj)
    ctx.status = 200
      ctx.body = {
        success: true,
        data: '',
        msg: '拒绝成功'
      }
  }

  // 同意
  public static async consentRequest(ctx: Context) {
    const { id, endStartTime, endEndTime } = ctx.request.body
    await getManager().getRepository(LeaveRequest).update({ id }, { endStartTime, endEndTime, requestState: 0 })
    const obj = new LeaveRequestCheck()
    const request = await getManager().getRepository(LeaveRequest).findOne({ id })
    obj.requestState = 0
    obj.checker = request?.auditor!
    await getManager().getRepository(LeaveRequestCheck).save(obj)
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: '同意成功'
    }
  }
}