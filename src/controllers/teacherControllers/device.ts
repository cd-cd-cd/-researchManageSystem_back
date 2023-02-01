import { Context } from "koa"
import { ValidationException } from "../../exceptions"
import { equipmentValidator } from "../../validators/teacherValidators/equipmentValidators"
import bouncer from 'koa-bouncer'
import dayjs from "dayjs"
import { getManager } from "typeorm"
import { Equipment } from "../../entity/equipment"
export default class DeviceController {
  // 老师添加设备
  public static async addEquipment(ctx: Context) {
    try {
      equipmentValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id: teacherId } = ctx.state.user
    const {
      serialNumber,
      name,
      version,
      originalValue,
      performanceIndex,
      address,
      warehouseEntryTime,
      HostRemarks,
      remark
    } = ctx.request.body
    const equipment = new Equipment()
    equipment.serialNumber = serialNumber
    equipment.name = name
    equipment.version = version
    equipment.originalValue = originalValue
    equipment.state = 0
    equipment.performanceIndex = performanceIndex
    equipment.address = address
    const newTime = dayjs(warehouseEntryTime).format('YYYY-MM-DD')
    equipment.warehouseEntryTime = newTime
    equipment.HostRemarks = HostRemarks
    equipment.remark = remark
    equipment.teacherId = teacherId
    const repository = getManager().getRepository(Equipment)
    const isExit = await repository.findOne({ serialNumber })
    if (!isExit) {
      await repository.save(equipment)
      ctx.status = 200
      ctx.body = {
        status: 10110,
        data: '',
        msg: '设备添加成功',
        success: true
      }
    } else {
      ctx.status = 200
      ctx.body = {
        status: 10111,
        data: '',
        msg: '此编号设备已存在,请检查编号是否输入正确',
        success: false
      }
    }
  }

  // 老师获取设备信息
  public static async equipmentList(ctx: Context) {
    const { id: teacherId } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const repository = getManager().getRepository(Equipment)
    const total = await repository.count({ teacherId })
    const lists = await repository.createQueryBuilder()
      .where({ teacherId })
      .orderBy('createdTime', 'DESC')
      .offset(offset)
      .limit(pageSize * 1)
      .getMany()
    ctx.status = 200
    ctx.body = {
      status: 10112,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        lists
      },
      msg: '设备信息获取成功',
      success: true
    }
  }

  // 老师修改设备信息
  public static async changeDeviceInfo(ctx: Context) {
    try {
      equipmentValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const {
      id,
      serialNumber,
      name,
      version,
      originalValue,
      performanceIndex,
      address,
      warehouseEntryTime,
      HostRemarks,
      remark
    } = ctx.request.body
    const repository = getManager().getRepository(Equipment)
    await repository.update({ id }, {
      serialNumber,
      name,
      version,
      originalValue,
      performanceIndex,
      address,
      warehouseEntryTime,
      HostRemarks,
      remark
    })
    ctx.status = 200
    ctx.body = {
      status: 10113,
      data: '',
      msg: '设备信息修改成功',
      success: true
    }
  }

  // 老师修改设备状态
  public static async toggleState(ctx: Context) {
    const { id, state } = ctx.request.body
    const repository = getManager().getRepository(Equipment)
    if (state === -1) {
      await repository.update({ id }, { state: 0 })
    } else if (state === 0) {
      await repository.update({ id }, { state: -1 })
    }
    ctx.status = 200
    ctx.body = {
      status: 10114,
      data: '',
      msg: '状态更新成功',
      success: true
    }
  }
}
