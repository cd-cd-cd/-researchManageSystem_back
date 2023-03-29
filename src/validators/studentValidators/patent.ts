import { Context } from "koa"

export const patentValidator = (ctx: Context) => {
  ctx.validateBody('name')
  .trim()
  .required('专利名称不为空')
  .isLength(0, 25, '专利名称不超过25字')

  ctx.validateBody('applicationNumber')
  .trim()
  .required('申请（专利）号不为空')
  .match(/^\d{13}$/, '申请专利号格式有误')

  ctx.validateBody('publicationNumber')
  .trim()
  .required('公开号不为空')
  .isLength(12, 12, '公开号格式有误')

  ctx.validateBody('patentRight')
  .trim()
  .required('申请（专利权）人不为空')
  .isLength(0, 100, '不超过100位')

  ctx.validateBody('inventor')
  .trim()
  .required('发明（设计）人不为空')
  .isLength(0, 100, '不超过100位')

  ctx.validateBody('digest')
  .trim()
  .required('摘要不为空')
  .isLength(0, 300, '摘要不超过300字')
}
