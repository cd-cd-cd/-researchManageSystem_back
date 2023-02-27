import { Context } from "koa";

export const leaveValidator = (ctx: Context) => {
  ctx.validateBody('reason')
  .trim()
  .required('理由不为空')
  .isLength(0, 255, '理由不超过255字')
}
