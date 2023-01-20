import Router from "@koa/router"
import ManagerController from "./controllers/manager"

import TeacherController from "./controllers/teacher"
import UserController from "./controllers/user"

const unProtectedRouter = new Router()
/*
user.ts
 */
// 创建管理员
unProtectedRouter.post('/createManager', UserController.createManager)
// 登录
unProtectedRouter.post('/user/login', UserController.login)

const protectedRouter = new Router()
protectedRouter.get('/user', UserController.showUserDetail)

/*
student.ts
 */


/*
teacher.ts
 */
// 老师创建学生
protectedRouter.post('/teacher/createStu', TeacherController.createStu)
protectedRouter.post('/teacher/updatePhone', TeacherController.updatePhone)
protectedRouter.post('/teacher/updateEmail', TeacherController.updateEmail)
protectedRouter.post('/teacher/updateResume', TeacherController.updateResume)


/*
manager.ts
 */

// 管理员创建老师
protectedRouter.post('/manager/createTeacher', ManagerController.createTeacher)

export {
  unProtectedRouter,
  protectedRouter
}