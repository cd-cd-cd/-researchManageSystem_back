import { Equipment } from "../entity/equipment"
import { Between, getManager, LessThan, MoreThan } from "typeorm"
import { Teacher } from "../entity/teacher"
import { MeetingRecord } from '../entity/meeting_record'
import { Meeting } from '../entity/meeting'
import { IEquipmentState, IMeeting, IMeetState, IRquest, IReimbersementState, IReimbursement, IReport, IRequestState, IReportState } from "../libs/model"
import { IDevice } from "../libs/model"
import dayjs from "dayjs"
import { exportExcel } from "./buildExcel"
import { User } from "../entity/user"
import { Reimbursement } from "../entity/reimbursement"
import { Report } from '../entity/report'
import { LeaveRequest } from '../entity/leaveRequest'

export const teacherDevicePart = async (id: string, startTime: Date, endTime: Date) => {
  const teacher = await getManager().getRepository(Teacher).findOne({ id })
  const deviceInfo = await getManager().getRepository(Equipment)
    .find({
      createdTime: Between(startTime, endTime),
      teacher,
    })

  const title = [
    '编号',
    '名称',
    '型号',
    '原值',
    '设备性能指标',
    '存放地',
    '状态',
    '入库日期',
    '主机备注',
    '备注',
    '添加日期'
  ]
  const renderState = (state: IEquipmentState) => {
    switch (state) {
      case 0:
        return '闲置'
      case -1:
        return '损坏'
      case 1:
        return '在用'
    }
  }
  const info = deviceInfo.reduce((pre: IDevice[], cur) => {
    pre.push({
      serialNumber: cur.serialNumber,
      name: cur.name,
      version: cur.version,
      originalValue: cur.originalValue,
      performanceIndex: cur.performanceIndex,
      address: cur.address,
      state: renderState(cur.state),
      warehouseEntryTime: dayjs(cur.warehouseEntryTime).format('YYYY-MM-DD'),
      HostRemarks: cur.HostRemarks,
      remark: cur.remark,
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])
  return exportExcel(title, info)
}

export const teacherMeetingPart = async (id: string, startTime: Date, endTime: Date) => {
  // 找到老师参加的会议
  const user = await getManager().getRepository(User).findOne({ trueId: id })
  const records = await getManager().getRepository(MeetingRecord)
    .find({
      where: [{ sponsor: user }, { participant: user }]
    })

  const filterMeeting = records
    .map(item => item.meeting.id)
    .filter((id, index, arr) => {
      return arr.indexOf(id) === index
    })

  const title = [
    '会议名称',
    '会议地点',
    '会议开始时间',
    '会议结束时间',
    '会议简要内容',
    '会议创建时间',
    '参会人',
    '发起人'
  ]

  const meetings = await getManager().getRepository(Meeting)
    .createQueryBuilder('meeting')
    .leftJoinAndSelect('meeting.records', 'record')
    .leftJoinAndSelect('meeting.sponsor', 'sponsor')
    .leftJoinAndSelect('record.participant', 'participant')
    .where('meeting.id IN (:...filterMeeting)', { filterMeeting })
    .andWhere({ startTime: MoreThan(startTime) })
    .andWhere({ endTime: LessThan(endTime) })
    .getMany()
  const info = meetings.reduce((pre: IMeeting[], cur) => {
    pre.push({
      title: cur.title,
      address: cur.address,
      startTime: dayjs(cur.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(cur.endTime).format('YYYY-MM-DD HH:mm:ss'),
      briefContent: cur.briefContent ? cur.briefContent : '',
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      participants: cur.records.map(item => item.participant.name).join('、'),
      sponsor: cur.sponsor.name
    })
    return pre
  }, [])
  return exportExcel(title, info)
}

export const teacherReimbursementPart = async (id: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: id })
  const res = await getManager().getRepository(Reimbursement).find({
    applyUser: user,
    createdTime: Between(startTime, endTime)
  })
  const renderState = (state: IReimbersementState) => {
    switch (state) {
      case -1:
        return '审核中'
      case 0:
        return '通过'
      case 1:
        return '拒绝'
    }
  }

  const info = res.reduce((pre: IReimbursement[], cur) => {
    pre.push({
      applyUserName: cur.applyUser.name,
      affairReason: cur.affairReason,
      amount: cur.amount.toString(),
      reimbursementState: renderState(cur.reimbursementState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])
  const title = [
    '申请人',
    '报销事务',
    '报销金额',
    '报销状态',
    '申请时间'
  ]

  return exportExcel(title, info)
}

// 待改
export const studentReportPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const reports = await getManager().getRepository(Report).find({
    report_submitter: user,
    startTime: MoreThan(startTime),
    endTime: LessThan(endTime)
  })
  const title = [
    '周报时间范围',
    '开始时间',
    '结束时间',
    '周报状态',
    '提交人',
    '查阅人',
    '提交时间',
    '周报'
  ]

  const renderState = (state: IReportState) => {
    switch (state) {
      case -1:
        return '未查看'
      case 0:
        return '未回复'
      case 1:
        return '已回复'
    }
  }
  const info = reports.reduce((pre: IReport[], cur) => {
    pre.push({
      timeRange: cur.time,
      startTime: dayjs(cur.startTime).format('YYYY-MM-DD'),
      endTime: dayjs(cur.endTime).format('YYYY-MM-DD'),
      state: renderState(cur.reportState),
      report_submitter: cur.report_submitter.name,
      report_reviewer: cur.report_reviewer.name,
      createTime: dayjs(cur.createdTime).format('YYYY-MM-DD'),
      pdf: cur.pdf
    })
    return pre
  }, [])
  return exportExcel(title, info)
}

export const studentMeetingPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const records = await getManager().getRepository(MeetingRecord)
    .find({
      where: [{ sponsor: user }, { participant: user }]
    })

  const filterMeeting = records
    .map(item => item.meeting.id)
    .filter((id, index, arr) => {
      return arr.indexOf(id) === index
    })

  const title = [
    '会议名称',
    '会议地点',
    '会议开始时间',
    '会议结束时间',
    '会议简要内容',
    '会议创建时间',
    '参会人',
    '发起人'
  ]

  const meetings = await getManager().getRepository(Meeting)
    .createQueryBuilder('meeting')
    .leftJoinAndSelect('meeting.records', 'record')
    .leftJoinAndSelect('meeting.sponsor', 'sponsor')
    .leftJoinAndSelect('record.participant', 'participant')
    .where('meeting.id IN (:...filterMeeting)', { filterMeeting })
    .andWhere({ startTime: MoreThan(startTime) })
    .andWhere({ endTime: LessThan(endTime) })
    .getMany()

  const info = meetings.reduce((pre: IMeeting[], cur) => {
    pre.push({
      title: cur.title,
      address: cur.address,
      startTime: dayjs(cur.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(cur.endTime).format('YYYY-MM-DD HH:mm:ss'),
      briefContent: cur.briefContent ? cur.briefContent : '',
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      participants: cur.records.map(item => item.participant.name).join('、'),
      sponsor: cur.sponsor.name
    })
    return pre
  }, [])
  return exportExcel(title, info)
}

export const studentReimbursementPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const res = await getManager().getRepository(Reimbursement).find({
    applyUser: user,
    createdTime: Between(startTime, endTime)
  })
  const renderState = (state: IReimbersementState) => {
    switch (state) {
      case -1:
        return '审核中'
      case 0:
        return '通过'
      case 1:
        return '拒绝'
    }
  }

  const info = res.reduce((pre: IReimbursement[], cur) => {
    pre.push({
      applyUserName: cur.applyUser.name,
      affairReason: cur.affairReason,
      amount: cur.amount.toString(),
      reimbursementState: renderState(cur.reimbursementState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])
  const title = [
    '申请人',
    '报销事务',
    '报销金额',
    '报销状态',
    '申请时间'
  ]
  return exportExcel(title, info)
}

export const studentRequetPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const requests = await getManager().getRepository(LeaveRequest)
    .find({
      askForLeavePerson: user,
      endStartTime: MoreThan(startTime),
      endEndTime: LessThan(endTime)
    })
  const title = [
    '申请人',
    '审核人',
    '请假开始时间',
    '请假结束时间',
    '请假原因',
    '请假状态',
    '申请时间'
  ]
  const renderState = (state: IRequestState) => {
    switch (state) {
      case -1:
        return '审核中'
      case 0:
        return '申请通过'
      case 1:
        return '申请拒绝'
    }
  }
  const info = requests.reduce((pre: IRquest[], cur) => {
    pre.push({
      askForLeavePerson: cur.askForLeavePerson.name,
      auditor: cur.auditor.name,
      startTime: dayjs(cur.endStartTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(cur.endEndTime).format('YYYY-MM-DD HH:mm:ss'),
      reason: cur.reason,
      requestState: renderState(cur.requestState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD HH:mm:ss')
    })
    return pre
  }, [])
  return exportExcel(title, info)
}