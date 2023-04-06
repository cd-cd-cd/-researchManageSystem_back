import { Equipment } from "../entity/equipment"
import { Between, getManager, LessThan, MoreThan } from "typeorm"
import { Teacher } from "../entity/teacher"
import { MeetingRecord } from '../entity/meeting_record'
import { Meeting } from '../entity/meeting'
import { IEquipmentState, IMeeting, IMeetState, IRquest, IReimbersementState, IReimbursement, IReport, IRequestState, IReportState, IThesis, IProductionState, IPatent, ICopyRight, IWin, IProject, IProjectState } from "../libs/model"
import { IDevice } from "../libs/model"
import dayjs from "dayjs"
import { exportExcel, exportManyExcel } from "./buildExcel"
import { User } from "../entity/user"
import { Reimbursement } from "../entity/reimbursement"
import { Report } from '../entity/report'
import { LeaveRequest } from '../entity/leaveRequest'
import { Thesis } from "../entity/thesis"
import { renderAwardGradeOption, renderAwardLevelOption, renderCopyRightType, renderDisciplineOne, renderPrincipalClassificationNumberOption, renderPublicationName } from "./renderFuc"
import { CopyRight } from "../entity/copyRight"
import { Winning } from "../entity/winning"
import { Patent } from "../entity/patent"
import { Project } from "../entity/project"

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

export const studentProductionPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const thesis = await getManager().getRepository(Thesis).find({
    applyThesisUser: user,
    createdTime: Between(startTime, endTime)
  })
  const copyRight = await getManager().getRepository(CopyRight).find({
    applyCopyRightUser: user,
    createdTime: Between(startTime, endTime)
  })
  const wins = await getManager().getRepository(Winning).find({
    applyWinUser: user,
    createdTime: Between(startTime, endTime)
  })

  const patents = await getManager().getRepository(Patent).find({
    applyPatentUser: user,
    createdTime: Between(startTime, endTime)
  })

  const renderState = (state: IProductionState) => {
    switch (state) {
      case -1:
        return '审核中'
      case 0:
        return '申请通过'
      case 1:
        return '申请拒绝'
    }
  }
  const ThesisData = thesis?.reduce((pre: IThesis[], cur) => {
    pre.push({
      title: cur.title,
      firstAuthor: cur.firstAuthor,
      publishDate: dayjs(cur.publishDate).format('YYYY-MM-DD'),
      publicationName: renderPublicationName(cur.publicationName),
      signature: cur.signature,
      discipline_one: renderDisciplineOne(cur.discipline_one),
      thesisState: renderState(cur.thesisState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])
  const ThesisTitle = [
    '专利名称',
    '第一作者',
    '发表时间',
    '发表刊物',
    '学校署名',
    '一级学科',
    '状态',
    '提交时间'
  ]

  const PatentData = patents?.reduce((pre: IPatent[], cur) => {
    pre.push({
      name: cur.name,
      applicationNumber: cur.applicationNumber,
      applicationDate: dayjs(cur.applicationDate).format('YYYY-MM-DD'),
      publicationNumber: cur.publicationNumber,
      openDay: dayjs(cur.applicationDate).format('YYYY-MM-DD'),
      principalClassificationNumber: renderPrincipalClassificationNumberOption(cur.principalClassificationNumber),
      patentRight: cur.patentRight,
      inventor: cur.inventor,
      digest: cur.digest,
      patentState: renderState(cur.patentState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])

  const patentTitle = [
    '专利名称',
    '申请（专利）号',
    '申请日',
    '公开（公告）号',
    '公开（公告）日',
    '主分类号',
    '申请（专利权）人',
    '发明（设计）人',
    '摘要',
    '状态',
    '提交时间'
  ]

  const CopyRightData = copyRight?.reduce((pre: ICopyRight[], cur) => {
    pre.push({
      name: cur.name,
      registerNumber: cur.registerNumber,
      category: renderCopyRightType(cur.category),
      copyrightOwner: cur.copyrightOwner,
      creationCompletionDate: dayjs(cur.creationCompletionDate).format('YYYY-MM-DD'),
      firstPublicationDate: dayjs(cur.firstPublicationDate).format('YYYY-MM-DD'),
      recordDate: dayjs(cur.recordDate).format('YYYY-MM-DD'),
      copyRightState: renderState(cur.copyRightState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])

  const CopyRightTitle = [
    '作品名称',
    '登记号',
    '作品类别',
    '著作权人',
    '创作完成日期',
    '首次发表日期',
    '登记日期',
    '状态',
    '提交时间'
  ]

  const winData = wins?.reduce((pre: IWin[], cur) => {
    pre.push({
      name: cur.name,
      awardGrade: renderAwardGradeOption(cur.awardGrade),
      awardLevel: renderAwardLevelOption(cur.awardLevel),
      awardTime: dayjs(cur.awardTime).format('YYYY-MM-DD'),
      organizingCommittee: cur.organizingCommittee,
      winState: renderState(cur.winState),
      createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
    })
    return pre
  }, [])

  const winTitle = [
    '获奖名称',
    '获奖等级',
    '获奖级别',
    '获奖时间',
    '大赛组委会',
    '状态',
    '提交时间'
  ]
  return exportManyExcel([
    { name: '论文', title: ThesisTitle, data: ThesisData, options: {} },
    { name: '专利', title: patentTitle, data: PatentData, options: {} },
    { name: '著作权', title: CopyRightTitle, data: CopyRightData, options: {} },
    { name: '获奖', title: winTitle, data: winData, options: {} }
  ])
}

export const studentProjectPart = async (studentId: string, startTime: Date, endTime: Date) => {
  const user = await getManager().getRepository(User).findOne({ trueId: studentId })
  const projects = await getManager().getRepository(Project)
    .find({
      manager: user,
      startTime: MoreThan(startTime),
      endTime: LessThan(endTime)
    })
    const title = [
      '项目名称',
      '指导老师',
      '状态',
      '项目成员',
      '开始时间',
      '截止时间',
      '提交时间'
    ]

    const renderState = (state: IProjectState) => {
      switch (state) {
        case -1:
          return '审核中'
        case 0:
          return '申请通过'
        case 1:
          return '申请拒绝'
        case 2:
          return '已结项'
      }
    }

    const info = projects.reduce((pre: IProject[], cur) => {
      pre.push({
        title: cur.title,
        teacherManager: cur.teacherManager.name,
        projectState: renderState(cur.projectState),
        startTime: dayjs(cur.startTime).format('YYYY-MM-DD'),
        endTime: dayjs(cur.endTime).format('YYYY-MM-DD'),
        createdTime: dayjs(cur.createdTime).format('YYYY-MM-DD')
      })
      return pre
    }, [])
    return exportExcel(title, info)
}