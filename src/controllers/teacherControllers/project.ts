import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { Project } from "../../entity/project";

export default class TeaProjectController {
  // 得到信息
  public static async getInfo(ctx: Context) {
    const { pageNum, pageSize, isAll } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    let projects, count
    if (isAll === 'true') {
      [projects, count] = await getManager().getRepository(Project).findAndCount({
      where: { teacherManager: user, projectExist: 1 },
      order: {
        createdTime: 'DESC'
      },
      skip: offset,
      take: pageSize
    })
    } else {
      [projects, count] = await getManager().getRepository(Project).findAndCount({
        where: { teacherManager: user, projectExist: 1, projectState: -1 },
        order: {
          createdTime: 'DESC'
        },
        skip: offset,
        take: pageSize
      })
    }
    const res = []
    for (let project of projects) {
      if (project.teammate.length !== 0) {
        const teamMate = []
        for (let teamId of project.teammate.split(';')) {
          const user = await getManager().getRepository(User).findOne({ trueId: teamId })
          teamMate.push(user)
        }
        res.push({
          id: project.id,
          title: project.title,
          manager: project.manager,
          teacherManager: project.teacherManager,
          projectState: project.projectState,
          projectExist: project.projectExist,
          teammate: teamMate,
          startTime: project.startTime,
          endTime: project.endTime,
          createdTime: project.createdTime
        })
      }
    }
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: '',
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        count,
        res
      }
    }
  }

  // 同意
  public static async pass(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Project).update({ id }, { projectState: 0 })
    ctx.status = 200
    ctx.body = {
      data: '',
      msg: '通过成功',
      success: true
    }
  }

  // 驳回
  public static async fail(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Project).update({ id }, { projectState: 1 })
    ctx.status = 200
    ctx.body = {
      data: '',
      msg: '驳回成功',
      success: true
    }
  }

  // 结项
  public static async overProject(ctx: Context) {
    const { id } = ctx.request.body
    await getManager().getRepository(Project).update({ id }, { projectState: 2 })
    ctx.status = 200
    ctx.body = {
      data: '',
      msg: '截止成功',
      success: true
    }
  }
}