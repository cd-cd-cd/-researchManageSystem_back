import Router from "@koa/router"
import ManagerController from "./controllers/manager"
import StudentController from "./controllers/studentControllers/student"
import DeviceController from "./controllers/teacherControllers/device"
import TeacherController from "./controllers/teacherControllers/teacher"
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
/*个人信息 */
// 学生修改个人信息
protectedRouter.put('/student/updateInfo', StudentController.updatePersonalInfo)

/*
teacher.ts
 */
// 老师创建学生
protectedRouter.post('/teacher/createStu', TeacherController.createStu)
// 老师信息修改
protectedRouter.post('/teacher/updatePhone', TeacherController.updatePhone)
protectedRouter.post('/teacher/updateEmail', TeacherController.updateEmail)
protectedRouter.post('/teacher/updateResume', TeacherController.updateResume)
protectedRouter.post('/teacher/updateAvatar', TeacherController.updateAvatar)
// 获得学生列表
protectedRouter.get('/teacher/stuList', TeacherController.stuList)
// 获得学生详细信息
protectedRouter.get('/teacher/getStuDetail', TeacherController.stuDetail)
// 老师删除学生
protectedRouter.delete('/teacher/deleteStu', TeacherController.deleteStu)
// 老师修改密码
protectedRouter.put('/teacher/passwordChange', TeacherController.changePassword)

/*设备管理*/
// 老师添加设备
protectedRouter.post('/teacher/device/addEquipment', DeviceController.addEquipment)
// 获得设备列表
protectedRouter.get('/teacher/device/getDeviceList', DeviceController.equipmentList)
// 修改设备信息
protectedRouter.put('/teacher/device/update', DeviceController.changeDeviceInfo)
// 更新设备状态
protectedRouter.put('/teacher/device/updateState', DeviceController.toggleState)
// 得到学生列表
protectedRouter.get('/teacher/decive/getStudentList', DeviceController.getStudentList)
// 指派设备
protectedRouter.put('/teacher/device/chooseStu', DeviceController.chooseStu)
// 设备回收
protectedRouter.put('/teacher/device/recovery', DeviceController.recoveryDevice)
/*
manager.ts
 */

// 管理员创建老师
protectedRouter.post('/manager/createTeacher', ManagerController.createTeacher)

export {
  unProtectedRouter,
  protectedRouter
}