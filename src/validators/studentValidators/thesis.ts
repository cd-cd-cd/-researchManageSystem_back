import { Context } from "koa";

export const thesisValidator = (ctx: Context) => {
  ctx.validateBody('title')
  .trim()
  .required('论文名称不为空')
  .isLength(0, 30, '论文题目不超过30字')

  ctx.validateBody('firstAuthor')
  .trim()
  .required('第一作者不为空')
  .isLength(0, 20, '名字不超过20字')

  ctx.validateBody('publishDate')
  .required('发表时间不为空')

  ctx.validateBody('signature')
  .trim()
  .required('学校署名不为空')
  .isLength(0, 20, '学校署名不超过20位')

  ctx.validateBody('disciplineOne')
  .required('一级学科不为空')
}