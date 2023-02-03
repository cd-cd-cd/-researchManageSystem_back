import { Context } from 'koa'
import { Teacher } from '../../entity/teacher'
import { getManager } from 'typeorm'
import { Equipment } from '../../entity/equipment'
import { DeviceApply } from '../../entity/device_apply'
import { ValidationException } from '../../exceptions'
import bouncer from 'koa-bouncer'
import { Student } from '../../entity/student'
import { applyDeviceValidator } from '../../validators/studentValidators/applyDevice'

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
    const repository = getManager().getRepository(DeviceApply)
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
    .getRawMany()
    ctx.status = 200
    ctx.body = {
      status: 20010,
      data: applys,
      msg: '',
      success: true
    }
  }
}
