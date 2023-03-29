import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import bouncer from 'koa-bouncer'
import { Patent } from "../../entity/patent";
import { patentValidator } from "../../validators/studentValidators/patent";
import { ValidationException } from "../../exceptions";

export default class StuProductionController {

  // 创建专利
  public static async createPatent(ctx: Context) {
    try {
      patentValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const {
      name,
      applicationNumber,
      applicationDate,
      publicationNumber,
      openDay,
      principalClassificationNumber,
      patentRight,
      inventor,
      digest
    } = ctx.request.body
    if (user) {
      const patent = new Patent()
      patent.name = name
      patent.applicationNumber = applicationNumber
      patent.applicationDate = applicationDate
      patent.publicationNumber = publicationNumber
      patent.openDay = openDay
      patent.principalClassificationNumber = principalClassificationNumber
      patent.patentRight = patentRight
      patent.inventor = inventor
      patent.digest = digest
      patent.applyPatentUser = user
      const result = await getManager().getRepository(Patent).save(patent)
      if (result) {
        ctx.status = 200
        ctx.body = {
          success: true,
          data: result,
          msg: '专利信息提交成功!'
        }
      } else {
        ctx.status = 200
        ctx.body = {
          success: false,
          data: result,
          msg: '专利信息提交失败， 请重试!'
        }
      }
    }
  }

  // 得到专利
  public static async getPatent(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const patents = await getManager().getRepository(Patent)
    .find({
      where: { applyPatentUser: user, patentExist: 1 },
      order: {
        createdTime: 'DESC'
      }
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: patents
    }
  }

  // 专利取消申请
  public static async cancelPatent(ctx: Context) {
    const { id: myId } = ctx.state.user
    const { id } = ctx.request.body
    const user = await getManager().getRepository(User).findOne({ trueId: myId })
    await getManager().getRepository(Patent).update({ applyPatentUser: user, id }, { patentExist: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '取消成功',
      data: ''
    }
  }
}