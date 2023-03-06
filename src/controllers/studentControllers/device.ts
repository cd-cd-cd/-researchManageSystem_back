import { Context } from 'koa'
import { Teacher } from '../../entity/teacher'
import { getManager } from 'typeorm'
import { Equipment } from '../../entity/equipment'
import { DeviceApply } from '../../entity/device_apply'
import { NotFoundException, ValidationException } from '../../exceptions'
import bouncer from 'koa-bouncer'
import { Student } from '../../entity/student'
import { applyDeviceValidator } from '../../validators/studentValidators/applyDevice'
import { DeviceDelivery } from '../../entity/device_delivery'

export default class StuDeviceController {
  // 学生申请设备
  public static async applyDevice(ctx: Context) {
    try {
      applyDeviceValidator(ctx)
    } catch (error) {
      if (error instanceof bouncer.ValidationError) {
        throw new ValidationException(error.message)
      }
    }
    const { id } = ctx.state.user
    const { equipmentId, reason, startTime, endTime } = ctx.request.body
    const repositoryTemp = getManager().getRepository(Student)
    const student = await repositoryTemp.findOne({ id })
    const repository = getManager().getRepository(DeviceApply)
    const isApplying = await repository.createQueryBuilder('apply')
      .where({ student })
      .andWhere({ equipmentId })
      .andWhere({ applyState: 0 })
      .getOne()
    if (!isApplying) {
      const apply = new DeviceApply()
      apply.equipmentId = equipmentId
      apply.apply_reason = reason
      apply.deviceApply_start_Time = startTime
      apply.deviceApply_end_Time = endTime
      apply.applyState = 0
      apply.student = id
      if (student?.teacher) {
        apply.teacher = student?.teacher
      }
      await repository.save(apply)
      ctx.status = 200
      ctx.body = {
        status: 20003,
        data: '',
        msg: '申请成功',
        success: true
      }
    } else {
      ctx.status = 200
      ctx.body = {
        status: 20004,
        data: '',
        msg: '你已经提交过该编号设备的申请了',
        success: false
      }
    }

  }

  // 学生获取闲置设备
  public static async idleDevice(ctx: Context) {
    const { id } = ctx.state.user
    const repository = getManager().getRepository(Student)
    const equipments = await repository
      .createQueryBuilder('student')
      .where({ id })
      .leftJoinAndSelect('student.teacher', 'teacher', 'teacher.id = student.teacher')
      .leftJoinAndSelect(Equipment, 'equipment', 'equipment.teacherId = teacher.id')
      .andWhere('equipment.state = 0')
      .select([
        'equipment.id as id',
        'equipment.serialNumber as serialNumber',
        'equipment.name as name'
      ])
      .getRawMany()
    ctx.status = 200
    ctx.body = {
      status: 20002,
      data: equipments,
      msg: '',
      success: true
    }
  }

  // 学生获取设备信息
  public static async deviceInfo(ctx: Context) {
    const { id } = ctx.state.user
    const { pageNum, pageSize } = ctx.query
    const offset = (pageNum - 1) * pageSize
    const repository = getManager().getRepository(DeviceApply)
    const total = await repository.count({ student: id })
    const applys = await repository
    .createQueryBuilder('apply')
    .leftJoinAndSelect(Equipment, 'equipment', 'apply.equipmentId = equipment.id')
    .select([
      'apply.id as id',
      'apply.applyState as applyState',
      'apply.deviceApply_start_Time as startTime',
      'apply.deviceApply_end_Time as endTime',
      'apply.apply_reason as apply_reason',
      'apply.refuseReason as refuseReason',
      'apply.createdTime as createdTime',
      'equipment.serialNumber as serialNumber',
      'equipment.name as name',
      'equipment.performanceIndex as performanceIndex',
      'equipment.address as address'
    ])
    .where({ student: id })
    .orderBy('createdTime', 'DESC')
    .offset(offset)
    .limit(pageSize * 1)
    .getRawMany()
    ctx.status = 200
    ctx.body = {
      status: 20010,
      data: {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total,
        applys
      },
      msg: '',
      success: true
    }
  }

  // 学生取消申请
  public static async cancelApply(ctx: Context) {
    const { applyId } = ctx.query
    console.log(ctx.request.body)
    console.log(applyId)
    const repository = getManager().getRepository(DeviceApply)
    const isExit = await repository.findOne({ id: applyId })
    if (!isExit) {
      throw new NotFoundException('没有该申请，请刷新后重试')
    } else {
      await repository.delete({ id: applyId })
      ctx.status = 200
      ctx.body = {
        status: 20011,
        data: '',
        msg: '取消成功',
        success: true
      }
    }
  }

  // 学生获得在借信息
  public static async getLoanInfo(ctx: Context) {
    const { id: studentId } = ctx.state.user
    const res = await getManager().getRepository(DeviceDelivery)
    .createQueryBuilder('delivery')
    .leftJoinAndSelect(Equipment, 'equipment', 'equipment.id = delivery.equipment')
    .where('equipment.recipient = :studentId', {studentId})
    .select([
      'equipment.id as equipmentId',
      'equipment.serialNumber as serialNumber',
      'equipment.name as name',
      'equipment.version as version',
      'equipment.performanceIndex as performanceIndex',
      'equipment.address as address',
      'equipment.HostRemarks as HostRemarks',
      'delivery.id as applyId',
      'delivery.deviceApply_start_Time as startTime',
      'delivery.deviceApply_end_Time as endTime',
    ])
    .getRawMany() 
    ctx.status = 200
    ctx.body = {
      status: 200,
      data: res,
      msg: '',
      success: true
    }
  }
}
