import { Context } from "koa"
import { ValidationException } from "../../exceptions"
import { equipmentValidator } from "../../validators/teacherValidators/equipmentValidators"
import bouncer from 'koa-bouncer'
import dayjs from "dayjs"
import { getManager } from "typeorm"
import { Equipment } from "../../entity/equipment"
import { Student } from "../../entity/student"
import { DeviceApply } from "../../entity/device_apply"
import { DeviceEntry } from "../../entity/device_entry"
import { DeviceDelivery } from "../../entity/device_delivery"
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
    const { id: teacher } = ctx.state.user
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
    equipment.teacher = teacher
    const repository = getManager().getRepository(Equipment)
    const isExit = await repository.createQueryBuilder('equipment')
      .where({ serialNumber })
      .andWhere({ teacher })
      .getRawOne()
    if (!isExit) {
      await repository.save(equipment)
      const deviceEntry = new DeviceEntry()
      deviceEntry.equipment = equipment
      await getManager().getRepository(DeviceEntry).save(deviceEntry)
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
    // const { id: teacherId } = ctx.state.user
    const { id: teacher } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const repository = getManager().getRepository(Equipment)
    const total = await repository.count({ teacher })
    // const total = await repository.count({ teacherId })
    const lists = await repository.createQueryBuilder('equipment')
      .leftJoinAndSelect(Student, 'stu', 'stu.id = equipment.recipient')
      // .where({ teacherId })
      .where({ teacher })
      .select([
        'equipment.id as id',
        'equipment.serialNumber as serialNumber',
        'equipment.name as name',
        'equipment.version as version',
        'equipment.originalValue as originalValue',
        'equipment.performanceIndex as performanceIndex',
        'equipment.address as address',
        'equipment.state as state',
        'equipment.warehouseEntryTime as warehouseEntryTime',
        'stu.name as recipient',
        'equipment.HostRemarks as HostRemarks',
        'equipment.remark as remark',
        'equipment.createdTime as createdTime'
      ])
      .orderBy('createdTime', 'DESC')
      .offset(offset)
      .limit(pageSize * 1)
      .getRawMany()
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
    const { id: teacher } = ctx.state.user
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
    const isExit = await repository.createQueryBuilder('equipment')
      .where({ serialNumber })
      .andWhere({ teacher })
      .getRawOne()
    if (!isExit) {
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
    } else {
      ctx.status = 200
      ctx.body = {
        status: 10118,
        data: '',
        msg: '设备编号重复',
        success: false
      }
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

  // 老师得到学生们id列表
  public static async getStudentList(ctx: Context) {
    const { id: teacher } = ctx.state.user
    const repository = getManager().getRepository(Student)
    const students = await repository.createQueryBuilder('student')
      .where({ teacher })
      .select(['student.id', 'student.name', 'student.username'])
      .getMany()
    ctx.status = 200
    ctx.body = {
      status: 10115,
      data: students,
      msg: '',
      success: true
    }
  }

  // 选择指派人
  public static async chooseStu(ctx: Context) {
    const { id } = ctx.state.user
    const { recipient, equipmentId, startTime, endTime } = ctx.request.body

    const repository = getManager().getRepository(Equipment)
    await repository.update({ id: equipmentId }, { recipient, state: 1 })

    const delivery = new DeviceDelivery()
    delivery.equipment = equipmentId
    delivery.deviceApply_start_Time = startTime
    delivery.deviceApply_end_Time = endTime
    // 出库
    await getManager().getRepository(DeviceDelivery).save(delivery)
    await getManager().getRepository(DeviceEntry).delete({ equipment: equipmentId })
    // 拒绝其他申请 
    await getManager().getRepository(DeviceApply).update({ equipmentId }, {
      applyState: -1,
      refuseReason: '已指派给他人',
      teacher: id
    })
    ctx.status = 200
    ctx.body = {
      status: 10116,
      data: '',
      msg: '设备指派成功',
      success: true
    }
  }

  // 回收设备
  public static async recoveryDevice(ctx: Context) {
    const { equipmentId: id } = ctx.request.body
    const repository = getManager().getRepository(Equipment)
    await repository.update({ id }, { recipient: '', state: 0 })
    // 删除出库 -》 入库
    await getManager().getRepository(DeviceDelivery).delete({ equipment: id })
    const entry = new DeviceEntry()
    entry.equipment = id
    await getManager().getRepository(DeviceEntry).save(entry)

    ctx.status = 200
    ctx.body = {
      status: 10117,
      data: '',
      msg: '设备回收成功',
      success: true
    }
  }

  // 老师获取信息
  public static async getApplyInfo(ctx: Context) {
    const { id } = ctx.state.user
    const repository = getManager().getRepository(DeviceApply)
    const num = await repository.createQueryBuilder('apply')
      .where({ teacher: id })
      .andWhere({ applyState: 0 })
      .getCount()
    const applyInfo = await repository.createQueryBuilder('apply')
      .leftJoinAndSelect(Equipment, 'equipment', 'equipment.id = apply.equipmentId')
      .leftJoinAndSelect(Student, 'student', 'student.id = apply.student')
      .select([
        'apply.id as id',
        'equipment.id as equipmentId',
        'equipment.serialNumber as serialNumber',
        'equipment.name',
        'apply.applyState as applyState',
        'apply.deviceApply_start_Time as startTime',
        'apply.deviceApply_end_Time as endTime',
        'apply.apply_reason as apply_reason',
        'apply.createdTime as createdTime',
        'student.id as studentId',
        'student.username as username',
        'student.name as studentName'
      ])
      .orderBy('createdTime', 'DESC')
      .where({ teacher: id })
      .andWhere({ applyState: 0 })
      .getRawMany()
    ctx.status = 200
    ctx.body = {
      status: 10120,
      data: {
        num,
        applyInfo
      },
      msg: '',
      success: true
    }
  }

  // 老师拒绝申请
  public static async refuseApply(ctx: Context) {
    const { id: teacher } = ctx.state.user
    const { id, reason: refuseReason } = ctx.request.body
    if (refuseReason.length <= 255) {
      await getManager().getRepository(DeviceApply).update(
        { id },
        {
          applyState: -1,
          refuseReason,
          teacher
        })
      ctx.status = 200
      ctx.body = {
        status: 10121,
        msg: '申请已拒绝',
        data: '',
        success: true
      }
    } else {
      throw new ValidationException('理由不超过255字')
    }
  }

  // 老师同意申请
  public static async consentApply(ctx: Context) {
    const { id: teacher } = ctx.state.user
    const { equipmentId, startTime, endTime, studentId } = ctx.request.body
    // 申请单状态改变
    await getManager().getRepository(DeviceApply).update(
      { equipmentId },
      {
        applyState: 1,
        teacher
      })
    // 入库删除
    await getManager().getRepository(DeviceEntry).delete({ equipment: equipmentId })
    // 出库添加
    const delivery = new DeviceDelivery()
    delivery.equipment = equipmentId
    delivery.deviceApply_start_Time = startTime
    delivery.deviceApply_end_Time = endTime
    await getManager().getRepository(DeviceDelivery).save(delivery)
    // 设备单领用人改变
    await getManager().getRepository(Equipment).update({ id: equipmentId}, { recipient: studentId, state: 1 })
    ctx.status = 200
    ctx.body = {
      status: 200,
      data: '',
      msg: '同意成功',
      success: true
    }
  }

}
