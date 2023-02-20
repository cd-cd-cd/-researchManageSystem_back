import Koa from 'koa'
import cors from '@koa/cors'
import path from 'path'
import fs from 'fs'
import bodyParser from 'koa-body'
import bouncer from 'koa-bouncer'
import { logger } from './logger'
import { unProtectedRouter, protectedRouter } from './routes'
import { createConnection } from 'typeorm'
import jwt from 'koa-jwt'
import dayjs from 'dayjs'

createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa()

    // 注册中间件
    app.use(logger())
    app.use(cors())
    app.use(bodyParser({ multipart: true, formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, './public/uploads'),
      onFileBegin: (name, file) => {
        // 无论是多文件还是单文件上传都会重复调用此函数
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname, './public/uploads')
        // 检查文件夹是否存在如果不存在则新建文件夹
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
          }
        // 文件名称去掉特殊字符但保留原始文件名称
        const fileName = dayjs() + '-' + file.name
        file.name = fileName
        // // 覆盖文件存放的完整路径(保留原始名称)
        file.path = `${dir}/${fileName}`
      }
  } }))
    app.use(bouncer.middleware())

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
    app.use(jwt({ secret: process.env.JWT_SECRET as string, key: 'user' }))
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

    // 运行服务器
    app.listen(80)
  }).catch((err: string) => console.log('TypeORM connection error:', err))