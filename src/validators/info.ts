import { Context } from 'koa'

// 验证电话号
export const phoneValidator = (ctx: Context) => {
  ctx.validateBody('phoneNumber')
  .required('密码不为空')
  .trim()
  .match(/^[1][3,4,5,7,8][0-9]{9}$/, '手机格式有误')
}

// 检查邮箱
export const emailValidator = (ctx: Context) => {
  ctx.validateBody('email')
  .required('邮箱不为空')
  .trim()
  .isEmail('邮箱格式有误')
}

// 检查个人简介
export const resumeValidator = (ctx: Context) => {
  ctx.validateBody('resume')
  .trim()
  .isLength(0, 200, '个人简介不超过200字')
}