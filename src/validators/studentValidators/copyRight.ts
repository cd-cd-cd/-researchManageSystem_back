import { Context } from "koa";

export const copyRightValidator = (ctx: Context) => {
  ctx.validateBody('registerNumber')
  .trim()
  .required('登记号不为空')
  .isLength(0, 20, '登记号格式不正确')

  ctx.validateBody('name')
  .trim()
  .required('作品名称不为空')
  .isLength(0, 15, '作品名称不超过15字')

  ctx.validateBody('copyrightOwner')
  .trim()
  .required('著作权人不为空')
  .isLength(0, 20, '著作权人长度不超过20字')
}