import { Context } from "koa";
import { Reimbursement } from "../../entity/reimbursement";
import { getManager } from "typeorm";

export default class MReimbursement {
  public static async getInfo(ctx: Context) {
    const { pageNum, pageSize, chooseUnchecked } = ctx.query
    const offset = (pageNum - 1) * pageSize
    let requests, total
    if (chooseUnchecked === 'true') {
      [requests, total] = await getManager().getRepository(Reimbursement).findAndCount({
        where: { reimbursementState: -1 },
        order: { createdTime: 'DESC' },
        skip: offset,
        take: pageSize
      })
    } else {
      [requests, total] = await getManager().getRepository(Reimbursement).findAndCount({
        where: {},
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

  // 同意
  public static async consent(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Reimbursement).update({ id }, { reimbursementState: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: '操作成功'
    }
  }

  // 拒绝
  public static async refuse(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Reimbursement).update({ id }, { reimbursementState: 1 })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: '',
      msg: '操作成功'
    }
  }
}