import { Context } from "koa";
import { User } from "../../entity/user";
import { getManager } from "typeorm";
import { Student } from "../../entity/student";
import bouncer from 'koa-bouncer'
import { projectValidator } from "../../validators/studentValidators/project";
import { ValidationException } from "../../exceptions";
import { Project } from "../../entity/project";
import { ProjectRecord } from "../../entity/projectRecord";

export default class StuProjectController {
  // 个人信息
  public static async getSelfName(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: user,
      msg: ''
    }
  }

  // 组内所有学生信息
  public static async stuInfo(ctx: Context) {
    const { id } = ctx.state.user
    const student = await getManager().getRepository(Student).findOne({ id })
    const teacher = student?.teacher
    const students = await getManager().getRepository(Student).find({
      where: { teacher },
      select: ['id', 'name']
    })
    const result = students.filter(item => item.id !== id).map(item => {
      return { value: item.id, label: item.name }
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      data: result,
      msg: ''
    }
  }

  // 创建提交项目
  public static async createProject(ctx: Context) {
    try {
      projectValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const student = await getManager().getRepository(Student).findOne({ id })
    const teacher = await getManager().getRepository(User).findOne({ trueId: student?.teacher.id })
    const { title, teammate, startTime, endTime } = ctx.request.body
    if (user && teacher) {
      const project = new Project()
      project.title = title
      project.manager = user
      project.teacherManager = teacher
      project.teammate = teammate
      project.startTime = startTime
      project.endTime = endTime

      const test = await getManager().getRepository(Project).save(project)
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: '项目申请已提交成功！',
        data: ''
      }
    }
  }

  // 得到项目信息
  public static async getInfo(ctx: Context) {
    const { id } = ctx.state.user
    const user = await getManager().getRepository(User).findOne({ trueId: id })
    const projects = await getManager().getRepository(Project)
      .find({
        where: { manager: user, projectExist: 1 },
        order: {
          createdTime: 'DESC'
        }
      })
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
      data: res
    }
  }

  // 更新项目
  public static async updateProject(ctx: Context) {
    const { id, researchProgress, nextPlan, fundPlan, clarification } = ctx.request.body
    const project = await getManager().getRepository(Project).findOne({ id })
    const record = new ProjectRecord()
    if (project) {
      record.project = project
      record.researchProgress = researchProgress
      record.nextPlan = nextPlan
      record.fundPlan = fundPlan
      record.clarification = clarification
      await getManager().getRepository(ProjectRecord).save(record)
      ctx.status = 200
      ctx.body = {
        success: true,
        data: '',
        msg: '更新成功'
      }
    }
  }

  // 查看进度
  public static async updateInfo(ctx: Context) {
    const { id } = ctx.query
    const project = await getManager().getRepository(Project).findOne({ id })
    const infos = await getManager().getRepository(ProjectRecord).find({
      where: { project },
      order: { createdTime: 'DESC' }
    })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: infos,
      msg: ''
    }
  }
}