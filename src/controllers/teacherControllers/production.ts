import { Context } from "koa";
import { Student } from "../../entity/student";
import { Teacher } from "../../entity/teacher";
import { Patent } from "../../entity/patent";
import { getManager } from "typeorm";
import { User } from "../../entity/user";
import { CopyRight } from "../../entity/copyRight";
import { Winning } from "../../entity/winning";
import { Thesis } from '../../entity/thesis'

export default class TeaProductionController {
  // 得到信息
  public static async getInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { nav } = ctx.query
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const teacher = await getManager().getRepository(Teacher).findOne({ id })
      const students = await getManager().getRepository(Student).find({ teacher })
      const studentIds = students.reduce((pre: string[], cur) => {
        pre.push(cur.id)
        return pre
      }, [])
    let infos, total
    if (nav === 'patent') {
      [infos, total] = await getManager().getRepository(Patent)
      .createQueryBuilder('patent')
      .leftJoinAndSelect('patent.applyPatentUser', 'applyPatentUser')
      .where('applyPatentUser.trueId IN (:...studentIds)', { studentIds })
      .andWhere({ patentExist: 1 })
      .orderBy('patent.createdTime', 'DESC')
      .skip(offset)
      .take(pageSize*1)
      .getManyAndCount()
    } else if (nav === 'copyright') {
      [infos, total] = await getManager().getRepository(CopyRight)
      .createQueryBuilder('copyRight')
      .leftJoinAndSelect('copyRight.applyCopyRightUser', 'applyCopyRightUser')
      .where('applyCopyRightUser.trueId IN (:...studentIds)', { studentIds })
      .andWhere({ copyRightExist: 1 })
      .orderBy('copyRight.createdTime', 'DESC')
      .skip(offset)
      .take(pageSize*1)
      .getManyAndCount()
    } else if (nav === 'winning') {
      [infos, total] = await getManager().getRepository(Winning)
      .createQueryBuilder('winning')
      .leftJoinAndSelect('winning.applyWinUser', 'applyWinUser')
      .where('applyWinUser.trueId IN (:...studentIds)', { studentIds })
      .andWhere({ winExist: 1 })
      .orderBy('winning.createdTime', 'DESC')
      .skip(offset)
      .take(pageSize*1)
      .getManyAndCount()
    } else if (nav === 'thesis') {
      [infos, total] = await getManager().getRepository(Thesis)
      .createQueryBuilder('thesis')
      .leftJoinAndSelect('thesis.applyThesisUser', 'applyThesisUser')
      .where('applyThesisUser.trueId IN (:...studentIds)', { studentIds })
      .andWhere({ thesisExist: 1 })
      .orderBy('thesis.createdTime', 'DESC')
      .skip(offset)
      .take(pageSize*1)
      .getManyAndCount()
    }
    ctx.status = 200
      ctx.body = {
        success: true,
        data: {
          pageNum: +pageNum,
          pageSize: +pageSize,
          total,
          infos
        },
        msg: ''
      }
  }

  // 通过
  public static async pass(ctx: Context) {
    const { type, id } = ctx.request.body
    switch (type) {
      case 'patent':
        await getManager().getRepository(Patent).update({ id }, { patentState: 0 })
      case 'thesis':
        await getManager().getRepository(Thesis).update({ id }, { thesisState: 0 })
      case 'copyright':
        await getManager().getRepository(CopyRight).update({ id }, { copyRightState: 0 })
      case 'winning':
        await getManager().getRepository(Winning).update({ id }, { winState: 0 })
    }
    ctx.status = 200
    ctx.body = {
      data: '',
      msg: '通过成功',
      success: true
    }
  }

  // 驳回
  public static async returnAsk(ctx: Context) {
    const { type, id } = ctx.request.body
    switch (type) {
      case 'patent':
        await getManager().getRepository(Patent).update({ id }, { patentState: 1 })
      case 'thesis':
        await getManager().getRepository(Thesis).update({ id }, { thesisState: 1 })
      case 'copyright':
        await getManager().getRepository(CopyRight).update({ id }, { copyRightState: 1 })
      case 'winning':
        await getManager().getRepository(Winning).update({ id }, { winState: 1 })
    }
    ctx.status = 200
    ctx.body = {
      data: '',
      msg: '驳回成功',
      success: true
    }
  }
}