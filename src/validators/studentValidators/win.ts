import { Context } from "koa";

export const winValidator = (ctx: Context) => {
  ctx.validateBody('name')
  .trim()
  .required('获奖名称不为空')
  .isLength(0, 30, '获奖名称不超过30字')

  ctx.validateBody('awardGrade')
  .trim()
  .required('获奖等级不为空')

  ctx.validateBody('awardTime')
  .required('获奖时间不为空')

  ctx.validateBody('organizingCommittee')
  .trim()
  .required('大赛组委会不为空')
  .isLength(0, 30, '长度不超过30字')

  ctx.validateBody('awardLevel')
  .required('获奖级别不为空')
}