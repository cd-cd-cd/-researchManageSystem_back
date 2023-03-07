import { Context } from "koa";
import { Student } from "../../entity/student";
import { Between, getManager, LessThan } from "typeorm";
import { Teacher } from "../../entity/teacher";
import { Equipment } from '../../entity/equipment'
import { deviceExcel } from "../../utils/buildExcel"
import { IDevice, IEquipmentState } from "../../libs/model";
import dayjs from "dayjs";

export default class DataController {
  // 得到学生
  public static async getStudent(ctx: Context) {
    const { id } = ctx.state.user
    const teacher = await getManager().getRepository(Teacher).findOne({ id })
    const students = await getManager().getRepository(Student)
      .find({
        where: { teacher },
        select: ["id", "name", "username"]
      })

    ctx.status = 200
    ctx.body = {
      success: true,
      data: students,
      msg: ''
    }
  }

  // 输出excel
  public static async exportExcel(ctx: Context) {
    const { id } = ctx.state.user
    const teacher = await getManager().getRepository(Teacher).findOne({ id })
    const { role, module, studentId, startTime, endTime } = ctx.request.body
    let buffer
    if (role === 1) {
      if (module === 'device') {
        const deviceInfo = await getManager().getRepository(Equipment)
          .find({
            createdTime: Between(startTime, endTime),
            teacher,
          })
        const renderState = (state: IEquipmentState) => {
          switch (state) {
            case 0:
              return '闲置'
            case -1:
              return '损坏'
            case 1:
              return '在用'
          }
        }
        const info = deviceInfo.reduce((pre: IDevice[], cur) => {
          pre.push({
            serialNumber: cur.serialNumber,
            name: cur.name,
            version: cur.version,
            originalValue: cur.originalValue,
            performanceIndex: cur.performanceIndex,
            address: cur.address,
            state: renderState(cur.state),
            warehouseEntryTime: dayjs(cur.warehouseEntryTime).format('YYYY-MM-DD'),
            HostRemarks: cur.HostRemarks,
            remark: cur.remark,
            createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
          })
          return pre
        }, [])
        buffer = deviceExcel(info)
      }
    }
        // 设置content-type请求头
        ctx.set('Content-Type', 'application/vnd.openxmlformats')

        ctx.status = 200
        ctx.body = {
          success: true,
          data: buffer
        }
  }

}