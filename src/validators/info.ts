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

// 检查学号
export const usernameValidator = (ctx: Context) => {
  ctx.validateBody('username')
  .trim()
  .match(/^[0-9]+.?[0-9]*$/, '学号不合法')
  .isLength(0, 20, '学号长度不超过20')
}

// 检查姓名
export const nameValidator = (ctx: Context) => {
  ctx.validateBody('name')
  .trim()
  .match(/^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.\s]{2,20})$/, '姓名不合法')
  .isLength(0, 20, '姓名长度不超过20')
}