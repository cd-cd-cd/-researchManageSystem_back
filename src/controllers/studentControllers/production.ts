import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import bouncer from 'koa-bouncer'
import { Patent } from "../../entity/patent";
import { patentValidator } from "../../validators/studentValidators/patent";
import { ValidationException } from "../../exceptions";
import { thesisValidator } from "../../validators/studentValidators/thesis";
import { Thesis } from "../../entity/thesis";
import { copyRightValidator } from "../../validators/studentValidators/copyRight";
import { CopyRight } from "../../entity/copyRight";
import { winValidator } from "../../validators/studentValidators/win";
import { Winning } from "../../entity/winning";

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

  // 创建论文
  public static async createThesis(ctx: Context) {
    try {
      thesisValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const {
      title,
      firstAuthor,
      publishDate,
      publicationName,
      signature,
      disciplineOne
    } = ctx.request.body
    if (user) {
      const thesis = new Thesis()
      thesis.title = title
      thesis.firstAuthor = firstAuthor
      thesis.publishDate = publishDate
      thesis.publicationName = publicationName
      thesis.signature = signature
      thesis.discipline_one = disciplineOne
      thesis.applyThesisUser = user
      const result = await getManager().getRepository(Thesis).save(thesis)
      if (result) {
        ctx.status = 200
        ctx.body = {
          success: true,
          data: result,
          msg: '论文信息提交成功!'
        }
      } else {
        ctx.status = 200
        ctx.body = {
          success: false,
          data: result,
          msg: '论文信息提交失败， 请重试!'
        }
      }
    }
  }

  // 得到论文历史记录
  public static async getThesis(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const thesis = await getManager().getRepository(Thesis)
      .find({
        where: { applyThesisUser: user, thesisExist: 1 },
        order: {
          createdTime: 'DESC'
        }
      })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: thesis
    }
  }

  // 取消论文申请
  public static async cancelThesis(ctx: Context) {
    const { id: myId } = ctx.state.user
    const { id } = ctx.request.body
    const user = await getManager().getRepository(User).findOne({ trueId: myId })
    await getManager().getRepository(Thesis).update({ applyThesisUser: user, id }, { thesisExist: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '取消成功',
      data: ''
    }
  }

  // 创建著作权
  public static async createCopyRight(ctx: Context) {
    try {
      copyRightValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const {
      registerNumber,
      name,
      category,
      copyrightOwner,
      creationCompletionDate,
      firstPublicationDate,
      recordDate
    } = ctx.request.body
    if (user) {
      const copyRight = new CopyRight()
      copyRight.registerNumber = registerNumber
      copyRight.name = name
      copyRight.category = category
      copyRight.copyrightOwner = copyrightOwner
      copyRight.creationCompletionDate = creationCompletionDate
      copyRight.firstPublicationDate = firstPublicationDate
      copyRight.recordDate = recordDate
      copyRight.applyCopyRightUser = user
      const result = await getManager().getRepository(CopyRight).save(copyRight)
      if (result) {
        ctx.status = 200
        ctx.body = {
          success: true,
          data: result,
          msg: '著作权信息提交成功!'
        }
      } else {
        ctx.status = 200
        ctx.body = {
          success: false,
          data: result,
          msg: '著作权信息提交失败， 请重试!'
        }
      }
    }
  }

  // 得到著作权信息
  public static async getCopyRight(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const copyRight = await getManager().getRepository(CopyRight)
      .find({
        where: { applyCopyRightUser: user, copyRightExist: 1 },
        order: {
          createdTime: 'DESC'
        }
      })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: copyRight
    }
  }

  // 取消著作权
  public static async cancelCopyRight(ctx: Context) {
    const { id: myId } = ctx.state.user
    const { id } = ctx.request.body
    const user = await getManager().getRepository(User).findOne({ trueId: myId })
    await getManager().getRepository(CopyRight).update({ applyCopyRightUser: user, id }, { copyRightExist: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '取消成功',
      data: ''
    }
  }

  // 创建获奖
  public static async createWin(ctx: Context) {
    try {
      winValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const {
      name,
      awardGrade,
      awardLevel,
      awardTime,
      organizingCommittee
    } = ctx.request.body
    if (user) {
      const win = new Winning()
      win.name = name
      win.awardGrade = awardGrade
      win.awardLevel = awardLevel
      win.awardTime = awardTime
      win.organizingCommittee = organizingCommittee
      win.applyWinUser = user
      const result = await getManager().getRepository(Winning).save(win)
      if (result) {
        ctx.status = 200
        ctx.body = {
          success: true,
          data: result,
          msg: '获奖信息提交成功!'
        }
      } else {
        ctx.status = 200
        ctx.body = {
          success: false,
          data: result,
          msg: '获奖信息提交失败， 请重试!'
        }
      }
    }
  }

  // 得到获奖信息
  public static async getWin(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const win = await getManager().getRepository(Winning)
      .find({
        where: { applyWinUser: user, winExist: 1 },
        order: {
          createdTime: 'DESC'
        }
      })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: win
    }
  }
  
  // 取消获奖
  public static async cancelWin(ctx: Context) {
    const { id: myId } = ctx.state.user
    const { id } = ctx.request.body
    const user = await getManager().getRepository(User).findOne({ trueId: myId })
    await getManager().getRepository(Winning).update({ applyWinUser: user, id }, { winExist: 0 })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '取消成功',
      data: ''
    }
  }
}