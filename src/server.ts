import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { logger } from './logger'
import { unProtectedRouter, protectedRouter } from './routes'
import { createConnection } from 'typeorm'
import 'reflect-metadata'

createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa()

    // 注册中间件
    app.use(logger())
    app.use(cors())
    app.use(bodyParser())

    // 错误中间件
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.status = err.status || 500
        ctx.body = { message: err.message }
      }
    })

    // 响应用户请求
    app.use(unProtectedRouter.routes()).use(unProtectedRouter.allowedMethods())
    // app.use(jwt({ secret: process.env.JWT_SECRET as string }))
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

    // 运行服务器
    app.listen(80)
  }).catch((err: string) => console.log('TypeORM connection error:', err))