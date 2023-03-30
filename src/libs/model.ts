type IRole = 0 | 1 | 2
// token的个人信息
interface IUser {
  id: string
  username: string
  name: string
  phoneNumber: string
  email?: string
  resume?: string
  avatar?: string
  createdTime?: Date
  role: IRole
}

// 设备状态 -1 -- 损坏 0 -- 闲置 1 -- 在用
type IEquipmentState = -1 | 0 | 1

// 设备申请状态  0 -- 申请中  1 -- 申请同意 -1 -- 申请被拒绝
type typeIApplyState = -1 | 0 | 1

// 会议状态 -1 -- 已结束  0 -- 正在进行  1 -- 还未开始 
type IMeetState = -1 | 0 | 1

// 周报状态 -1 -- 未查看     0 --- 查看了但没回复  1 --- 查看了并回复了
type IReportState = -1 | 0 | 1

// 请假状态 -1 -- 审核中  0 -- 申请通过 1 -- 申请拒绝
type IRequestState = -1 | 0 | 1

// 报销状态 -1 --- 审核中 0 -- 通过  1 -- 拒绝
type IReimbersementState = -1 | 0 | 1

// 专利状态 -1未审批 0审批通过 1审批打回
type IPatentState = -1 | 0 | 1

// 专利申请 0不存在 1存在
type IPatentExist = 0 | 1

// 论文状态 -1未审批 0审批通过 1审批打回
type IThesisState = -1 | 0 | 1

// 论文申请 0不存在 1存在
type IThesisExist = 0 | 1

// 著作权
type ICopyRightState = -1 | 0 | 1
type ICopyRightExist = 0 | 1

// 获奖
type IWinState = -1 | 0 | 1
type IWinExist = 0 | 1

//excel
interface IDevice {
  serialNumber: string
  name: string
  version: string
  originalValue: string
  performanceIndex: string
  address: string
  state: string
  warehouseEntryTime: string
  HostRemarks: string
  remark: string
  createdTime: string
}

interface IMeeting {
  title: string
  address: string
  startTime: string
  endTime: string
  briefContent: string
  createdTime: string
  participants: string
  sponsor: string
}

interface IReimbursement {
  applyUserName: string
  affairReason: string
  amount: string
  reimbursementState: string
  createdTime: string
}

interface IReport {
  timeRange: string
  startTime: string
  endTime: string
  state: string
  report_submitter: string
  report_reviewer: string
  createTime: string
  pdf: string
}

interface IRquest {
  startTime: string
  endTime: string
  reason: string
  askForLeavePerson: string
  auditor: string
  requestState: string
  createdTime: string
}

export type {
  IRole,
  IUser,
  IEquipmentState,
  typeIApplyState,
  IMeetState,
  IReportState,
  IRequestState,
  IReimbersementState,
  IDevice,
  IMeeting,
  IReimbursement,
  IReport,
  IRquest,
  IPatentState,
  IPatentExist,
  IThesisState,
  IThesisExist,
  ICopyRightState,
  ICopyRightExist,
  IWinState,
  IWinExist
}