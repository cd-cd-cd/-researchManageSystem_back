import Router from "@koa/router"
import DataManageController from "./controllers/managerControllers/dataManage"
import ManagerController from "./controllers/managerControllers/manager"
import MReimbursement from "./controllers/managerControllers/reimbursement"
import StuDeviceController from "./controllers/studentControllers/device"
import StuLeaveController from "./controllers/studentControllers/leave"
import MeetingController from "./controllers/studentControllers/meeting"
import StuProductionController from "./controllers/studentControllers/production"
import StuReportController from "./controllers/studentControllers/report"
import StudentController from "./controllers/studentControllers/student"
import DataController from "./controllers/teacherControllers/dataManage"
import DeviceController from "./controllers/teacherControllers/device"
import TeacherLeaveController from "./controllers/teacherControllers/leave"
import TeaProductionController from "./controllers/teacherControllers/production"
import UserReimbursement from "./controllers/teacherControllers/reimbursement"
import teacherReportController from "./controllers/teacherControllers/report"
import TeacherController from "./controllers/teacherControllers/teacher"
import UserController from "./controllers/user"
import StuProjectController from "./controllers/studentControllers/project"
import TeaProjectController from "./controllers/teacherControllers/project"

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
protectedRouter.put('/student/avatar', StudentController.updateAvatar)
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
// 上传pdf
protectedRouter.post('/student/report/pdf', StuReportController.uploadPdf)
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

/*成果管理 */
// 提交专利
protectedRouter.post('/student/production/createPatent', StuProductionController.createPatent)
protectedRouter.get('/student/production/getPatent', StuProductionController.getPatent)
// 取消专利申请
protectedRouter.put('/student/production/cancelPatent', StuProductionController.cancelPatent)
// 提交论文
protectedRouter.post('/student/production/createThesis', StuProductionController.createThesis)
// 得到论文历史
protectedRouter.get('/student/production/getThesis', StuProductionController.getThesis)
// 取消论文申请
protectedRouter.put('/student/production/cancelThesis', StuProductionController.cancelThesis)
// 创建著作权
protectedRouter.post('/student/production/createCopyRight', StuProductionController.createCopyRight)
// 得到著作权历史
protectedRouter.get('/student/production/getCopyRight', StuProductionController.getCopyRight)
// 取消著作权
protectedRouter.put('/student/production/cancelCopyRight', StuProductionController.cancelCopyRight)
// 获奖
protectedRouter.post('/student/production/createWin', StuProductionController.createWin)
protectedRouter.get('/student/production/createWin', StuProductionController.getWin)
protectedRouter.put('/student/production/cancelWin', StuProductionController.cancelWin)

/*项目管理 */
// 得到自己的信息
protectedRouter.get('/student/project/getSelf', StuProjectController.getSelfName)
// 得到组内成员信息
protectedRouter.get('/student/project/stuInfo', StuProjectController.stuInfo)
protectedRouter.post('/student/project/create', StuProjectController.createProject)
// 得到信息
protectedRouter.get('/student/project/getInfo', StuProjectController.getInfo)
// 更新项目
protectedRouter.post('/student/project/updateProject', StuProjectController.updateProject)
// 查看更新信息
protectedRouter.get('/student/project/historyUpdate', StuProjectController.updateInfo)

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

/*数据管理 */
protectedRouter.get('/teacher/data/getStu', DataController.getStudent)
protectedRouter.post('/teacher/data/excel', DataController.exportExcel)

/*成果管理 */
protectedRouter.get('/teacher/production/info', TeaProductionController.getInfo)
// 通过&驳回
protectedRouter.put('/teacher/production/pass', TeaProductionController.pass)
protectedRouter.put('/teacher/production/returnAsk', TeaProductionController.returnAsk)

/*项目管理 */
protectedRouter.get('/teacher/project/getInfo', TeaProjectController.getInfo)
protectedRouter.put('/teacher/project/pass', TeaProjectController.pass)
protectedRouter.put('/teacher/project/fail', TeaProjectController.fail)
// 结项
protectedRouter.put('/teacher/project/over', TeaProjectController.overProject)


/*
manager.ts
 */

// 管理员创建老师
protectedRouter.post('/manager/createTeacher', ManagerController.createTeacher)
// 创建学生
protectedRouter.post('/manager/createStudent', ManagerController.createStudent)
/*成员信息 */
protectedRouter.get('/manager/info/getStu', ManagerController.getStudentInfos)
protectedRouter.get('/manager/info/getTeacher', ManagerController.getTeacherInfos)
// 得到老师
protectedRouter.get('/manager/info/getSelect', ManagerController.getTeacher)
/*报销 */
protectedRouter.get('/manager/reimbursement/getInfo', MReimbursement.getInfo)
// 同意
protectedRouter.put('/manager/reimbursement/consent', MReimbursement.consent)
// 拒绝
protectedRouter.put('/manager/reimbursement/refuse', MReimbursement.refuse)

// 初始化学生密码
protectedRouter.put('/manager/stu/init', ManagerController.initStu)
// 初始化老师密码
protectedRouter.put('/manager/teacher/init', ManagerController.initTeacher)
// 查找学生
protectedRouter.get('/manager/search/student', ManagerController.searchStudent)
// 查找老师
protectedRouter.get('/manager/search/teacher', ManagerController.searchTeacher)

// 得到管理员自己信息
protectedRouter.get('/manager/self', ManagerController.getSelfInfo)
/* 数据管理 */
protectedRouter.get('/manager/data/getList', DataManageController.getList)
protectedRouter.post('/manager/data/excel', DataManageController.exportExcel)

export {
  unProtectedRouter,
  protectedRouter
}