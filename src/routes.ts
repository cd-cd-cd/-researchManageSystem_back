import Router from "@koa/router"

import AuthController from "./controllers/auth"
import UserController from "./controllers/user"

const unProtectedRouter = new Router()
unProtectedRouter.post('/auth/login', AuthController.login)

const protectedRouter = new Router()
protectedRouter.post('/auth/register', AuthController.createStu)
protectedRouter.get('/user/:id', UserController.showUserDetail)

export {
  unProtectedRouter,
  protectedRouter
}