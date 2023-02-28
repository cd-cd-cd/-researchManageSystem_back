import { Context } from 'koa'
export const reimbursementValidator = (ctx: Context) => {
  ctx.validateBody('affair')
  .trim()
  .required('具体事务不为空')
  .isLength(0, 255, '具体事务描述不超过255字')

  ctx.validateBody('sum')
  .required('输入金额不为空')
}