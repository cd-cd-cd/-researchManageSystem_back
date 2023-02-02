import { Context } from 'koa'
import { Teacher } from '../../entity/teacher'
import { getManager } from 'typeorm'
import { Equipment } from '../../entity/equipment'
import { DeviceApply } from '../../entity/device_apply'
import { ValidationException } from '../../exceptions'
import bouncer from 'koa-bouncer'
import { Student } from '../../entity/student'

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
    const { serialNumber, reason, startTime, endTime } = ctx.request.body
    const repositoryTemp = getManager().getRepository(Student)
    const student = await repositoryTemp.findOne({ id })
    console.log(student)
    const repository = getManager().getRepository(DeviceApply)
    const apply = new DeviceApply()
    apply.serialNumber = serialNumber
    apply.apply_reason = reason
    apply.deviceApply_start_Time = startTime
    apply.deviceApply_end_Time = endTime
    apply.applyState = 0
    apply.student = id
    if (student?.teacher) {
      apply.teacherId = student?.teacher.id
    }
    await repository.save(apply)
    ctx.status = 200
    ctx.body = {
      status: 20003,
      data: '',
      msg: '申请成功',
      success: true
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

}

function applyDeviceValidator(ctx: Context) {
  throw new Error('Function not implemented.')
}
