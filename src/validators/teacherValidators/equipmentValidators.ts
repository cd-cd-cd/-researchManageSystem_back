import { Context } from 'koa'

const equipmentValidator = (ctx: Context) => {
  ctx.validateBody('serialNumber')
  .trim()
  .required('编号不为空')
  .isLength(0, 50, '编号长度不超过50')

  ctx.validateBody('name')
  .trim()
  .required('设备名称不为空')
  .isLength(0, 50, '设备名称长度不超过50')

  ctx.validateBody('version')
  .trim()
  .required('设备型号不为空')
  .isLength(0, 50, '设备型号长度不超过50')

  ctx.validateBody('originalValue')
  .trim()
  .required('设备原值不为空')
  .isLength(0, 50, '设备原值长度不超过50')

  ctx.validateBody('performanceIndex')
  .trim()
  .isLength(0, 255, '设备性能指标描述不超过255')

  ctx.validateBody('address')
  .trim()
  .isLength(0, 50, '地址长度不超过50')

  ctx.validateBody('warehouseEntryTime')
  .trim()

  ctx.validateBody('HostRemarks')
  .trim()
  .isLength(0, 255, '主机备注长度不超过255')

  ctx.validateBody('remark')
  .trim()
  .isLength(0, 255, '备注长度不超过255')
}

export {
  equipmentValidator
}