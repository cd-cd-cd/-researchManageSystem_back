import { Context } from "koa";
import bouncer from 'koa-bouncer'
import { reimbursementValidator } from "../../validators/commonValidators/reimbursement";
import { Reimbursement } from "../../entity/reimbursement";
import { ValidationException } from "../../exceptions";
import { getManager } from "typeorm";
import { User } from "../../entity/user";
import path from 'path'
import { put, removeFileDir } from "../../utils/fileFunc";

export default class UserReimbursement {
  // 提交报销材料
  public static async postBasicInfo(ctx: Context) {
    const { affair, sum } = ctx.request.body
    try {
      reimbursementValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const applyUser = await getManager().getRepository(User).findOne({ trueId: id })
    // const { affair, sum } = ctx.request.body
    if (applyUser) {
      const obj = new Reimbursement()
      obj.affairReason = affair
      obj.amount = sum
      obj.applyUser = applyUser
      const res = await getManager().getRepository(Reimbursement).save(obj)
      ctx.status = 200
      ctx.body = {
        success: true,
        data: res.id,
        msg: '上传成功'
      }
    }
  }

  // 提交pdf
  public static async postPdf(ctx: Context) {
    const { id } = ctx.query
    const files = ctx.request.files as any
    const updateMatetial = async (id: string, url: string) => {
      await getManager().getRepository(Reimbursement).update({ id }, { invoice: url })
    }
    const url = await put(files.file, '/reimbursement/')
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
  }

  // 提交其他材料
  public static async postCredential(ctx: Context) {
    const { id, num } = ctx.query
    const files = ctx.request.files as any

    const updateMatetial = async (id: string, url: string) => {
      await getManager().getRepository(Reimbursement).update({ id }, { credential: url })
    }

    if (+num === 1) {
      const url = await put(files.file, '/reimbursement/')
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
        const urlPromise = put(file, '/reimbursement/')
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
        msg: '申请已发送',
        data: ''
      }
    }
  }

  // 得到报销申请
  public static async getInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const [applys, total] = await getManager().getRepository(Reimbursement)
      .findAndCount({
        where: { applyUser: user },
        order: { createdTime: 'DESC' },
        skip: offset,
        take: pageSize
      })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        applys
      }
    }
  }
}