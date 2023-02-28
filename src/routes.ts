import Router from "@koa/router"
import ManagerController from "./controllers/manager"
import MReimbursement from "./controllers/managerControllers/reimbursement"
import StuDeviceController from "./controllers/studentControllers/device"
import StuLeaveController from "./controllers/studentControllers/leave"
import MeetingController from "./controllers/studentControllers/meeting"
import StuReportController from "./controllers/studentControllers/report"
import StudentController from "./controllers/studentControllers/student"
import DeviceController from "./controllers/teacherControllers/device"
import TeacherLeaveController from "./controllers/teacherControllers/leave"
import UserReimbursement from "./controllers/teacherControllers/reimbursement"
import teacherReportController from "./controllers/teacherControllers/report"
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
protectedRouter.put('/student/changePassword', StudentController.changePassword)
/*设备管理 */
// 得到闲置数据
protectedRouter.get('/student/device/getIdleDevice', StuDeviceController.idleDevice)
// 申请设备
protectedRouter.post('/student/device/apply', StuDeviceController.applyDevice)
// 获取申请信息
protectedRouter.get('/student/device/applyInfo', StuDeviceController.deviceInfo)
// 取消申请信息
protectedRouter.delete('/student/device/cancelApply', StuDeviceController.cancelApply)
// 获取在借设备
protectedRouter.get('/student/device/loan', StuDeviceController.getLoanInfo)

/*发起会议 */
// 获得人选
protectedRouter.get('/meet/participants', MeetingController.getParticipants)
// 发起会议
protectedRouter.post('/meet/create', MeetingController.createMeet)
// 发起会议（上传资料）
protectedRouter.post('/meet/material', MeetingController.postMaterial)
// 得到会议
protectedRouter.get('/meet/get', MeetingController.getMeetings)

/* 周报 */
// 上传周报
protectedRouter.post('/student/report/create', StuReportController.uploadReport)
// 得到周报记录
protectedRouter.get('/student/report/record', StuReportController.getReportRecord)
// 回复评论
protectedRouter.post('/student/report/replyComment', StuReportController.replyComment)
// 得到二级评论
protectedRouter.get('/student/report/secondComment', StuReportController.getSecondComments)

/*请假管理 */
// 上传请假
protectedRouter.post('/studetnt/leave/postLeaveReques', StuLeaveController.postLeaveRequest)
// 上传请假资料
protectedRouter.post('/student/leave/material', StuLeaveController.postLeaveMaterial)
// 得到请假信息
protectedRouter.get('/student/leave/getInfo', StuLeaveController.getLeaveRequest)
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
// 得到申请信息
protectedRouter.get('/teacher/device/applyInfo', DeviceController.getApplyInfo)
// 拒绝申请
protectedRouter.put('/teacher/device/refuseApply', DeviceController.refuseApply)
// 老师同意申请
protectedRouter.post('/teacher/device/consent', DeviceController.consentApply)

/*周报管理*/
// 得到周报
protectedRouter.get('/teacher/report/infos', teacherReportController.getReportInfo)
// 查看周报
protectedRouter.put('/teacher/report/review', teacherReportController.checkReport)
// 评论周报
protectedRouter.post('/teacher/report/comment', teacherReportController.commentReport)
// 得到某个周报一级评论
protectedRouter.get('/teacher/report/firstComment', teacherReportController.getFirstReportComment)

/*请假管理 */
protectedRouter.get('/teacher/leave/getInfo', TeacherLeaveController.getRequestInfo)
// 拒绝
protectedRouter.post('/teacher/leave/refuse', TeacherLeaveController.refuseRequest)
// 同意
protectedRouter.post('/teacher/leave/consent', TeacherLeaveController.consentRequest)

/*报销 */
// 基础资料
protectedRouter.post('/user/reimbursement/basicInfo', UserReimbursement.postBasicInfo)
// pdf
protectedRouter.post('/user/reimbursement/pdf', UserReimbursement.postPdf)
protectedRouter.post('/user/reimbursement/credential', UserReimbursement.postCredential)
// 得到报销信息
protectedRouter.get('/user/reimbursement/getInfo', UserReimbursement.getInfo)

/*
manager.ts
 */

// 管理员创建老师
protectedRouter.post('/manager/createTeacher', ManagerController.createTeacher)

/*报销 */
protectedRouter.get('/manager/reimbursement/getInfo', MReimbursement.getInfo)
// 同意
protectedRouter.put('/manager/reimbursement/consent', MReimbursement.consent)
// 拒绝
protectedRouter.put('/manager/reimbursement/refuse', MReimbursement.refuse)

export {
  unProtectedRouter,
  protectedRouter
}