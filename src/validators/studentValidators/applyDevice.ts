import { Context } from 'koa'

const applyDeviceValidator = (ctx: Context) => {
  ctx.validateBody('equipmentId')
  .required('设备不为空')
  
  ctx.validateBody('reason')
  .isLength(0, 255, '理由不超过255字')

  ctx.validateBody('startTime')
  .required('开始时间不为空')

  ctx.validateBody('endTime')
  .required('结束时间不为空')
}

export {
  applyDeviceValidator
}