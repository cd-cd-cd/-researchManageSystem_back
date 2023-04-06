import { Context } from "koa";

export const projectValidator = (ctx: Context) => {
  ctx.validateBody('title')
  .required('项目标题不为空')
  .isLength(0, 30, '项目长度不超过30')
}