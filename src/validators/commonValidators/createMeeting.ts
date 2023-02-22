import { Context } from 'koa'
export const MeetingValidator = (ctx: Context) => {
  ctx.validateBody('title')
  .trim()
  .required('会议标题不为空')
  .isLength(1, 20, '会议标题不超过20字')

  ctx.validateBody('briefContent')
  .trim()
  .isLength(1, 100, '会议简介不超过100字')

  ctx.validateBody('address')
  .trim()
  .isLength(1, 50, '会议地址不超过50字')
}